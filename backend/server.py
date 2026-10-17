from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import uuid

from auth import hash_password, verify_password
from app.database import client, repositories, logger
from app.schemas import BlogPost, KBArticle, now_iso

app = FastAPI(title="Elitec IT Services API")


from app.api.public import api_router
from app.api.auth import auth_router
from app.api.tickets import tickets_router
from app.api.knowledge_base import kb_router
from app.api.blog import blog_router

# ---------- Seeding ----------
async def seed_users():
    """Idempotent seed for admin + demo customer."""
    seeds = [
        {
            "email": os.environ["ADMIN_EMAIL"].lower(),
            "password": os.environ["ADMIN_PASSWORD"],
            "name": "Elitec Admin", "role": "admin", "company": "Elitec",
        },
        {
            "email": os.environ["CUSTOMER_EMAIL"].lower(),
            "password": os.environ["CUSTOMER_PASSWORD"],
            "name": "Demo Customer", "role": "customer", "company": "Acme Corp",
        },
    ]
    for s in seeds:
        existing = await repositories.users.find_one({"email": s["email"]})
        if existing is None:
            await repositories.users.insert_one({
                "id": str(uuid.uuid4()), "email": s["email"], "name": s["name"],
                "role": s["role"], "company": s["company"],
                "password_hash": hash_password(s["password"]),
                "created_at": now_iso(),
            })
            logger.info(f"Seeded user: {s['email']}")
        elif not verify_password(s["password"], existing["password_hash"]):
            await repositories.users.update_one(
                {"email": s["email"]},
                {"$set": {"password_hash": hash_password(s["password"])}},
            )


SEED_BLOG = [
    {"title": "5 lessons from a zero-downtime Azure migration", "title_fr": "5 leçons d'une migration Azure sans interruption",
     "category": "Microsoft Azure",
     "excerpt": "How we replatformed a 14-server finance workload to Azure without a single user noticing.",
     "body": "## The challenge\n\nA finance client running 14 on-prem servers needed to move to Azure with zero downtime.\n\n## Our approach\n\n1. **Discovery & dependency mapping** — every workload, every integration.\n2. **Pilot wave** — move 2 non-critical servers first.\n3. **Cutover plan** — DNS swing, rollback gate, comms tree.\n\n## Results\n\n- 99.99% uptime through cutover\n- 32% TCO reduction in year one\n- Engineering team unblocked from infra firefighting", "read_time": "6 min"},
    {"title": "Anatomy of a modern phishing attack — and how to stop it",
     "category": "Cybersecurity",
     "excerpt": "Real-world examples from our SOC and the controls that actually move the needle.",
     "body": "Phishing is no longer about misspelled emails from fake princes. Modern campaigns use:\n\n- AI-generated copy that mimics internal tone\n- Lookalike domains registered hours before the attack\n- Multi-stage payloads that evade sandboxes\n\n## What actually works\n\n1. Hardware MFA keys for privileged accounts.\n2. Email DMARC + ARC.\n3. User awareness with real simulations.\n4. SOC monitoring with automated containment.", "read_time": "8 min"},
    {"title": "A pragmatic Microsoft 365 rollout for 500 users",
     "category": "Microsoft 365",
     "excerpt": "Phasing, communications, and the unglamorous details that decide whether adoption sticks.",
     "body": "Successful M365 rollouts are 30% technical and 70% change management. Here is the playbook we use.", "read_time": "5 min"},
    {"title": "In-house SOC vs MSSP: when does each make sense?",
     "category": "Cybersecurity",
     "excerpt": "A decision framework based on size, regulation, and risk appetite.",
     "body": "Build vs buy is one of the highest-leverage decisions a CISO makes. Here is how to think about it.", "read_time": "7 min"},
    {"title": "Cutting cloud spend without cutting performance",
     "category": "Cloud Computing",
     "excerpt": "Six FinOps moves that consistently produce 20-35% savings.",
     "body": "Most cloud overspend hides in three places: idle resources, oversized SKUs, and unused commitments.", "read_time": "6 min"},
    {"title": "Why digital transformation programs fail (and how to save yours)",
     "category": "Digital Transformation",
     "excerpt": "Patterns we see again and again, plus the antidotes that work.",
     "body": "After 50+ transformation engagements, the failure modes are predictable. Here is our short list.", "read_time": "9 min"},
]


SEED_KB = [
    {"title": "How to submit a support ticket", "category": "Getting Started",
     "summary": "A 60-second guide to logging tickets that get resolved fast.",
     "body": "1. Log in to the client portal.\n2. Click **New Ticket**.\n3. Pick a priority (Low / Medium / High / Critical).\n4. Describe the impact, the steps to reproduce, and any error messages.\n5. Submit — you will be notified by email when an engineer picks it up."},
    {"title": "Resetting your Microsoft 365 password", "category": "Microsoft 365",
     "summary": "Self-service password reset for M365 accounts under Elitec management.",
     "body": "Visit https://aka.ms/sspr, enter your work email, complete the MFA challenge, and choose a new password."},
    {"title": "Reporting a phishing email", "category": "Cybersecurity",
     "summary": "What to do when you receive a suspicious email.",
     "body": "Do not click any links. Use the **Report Phishing** button in Outlook (top right of the message). Our SOC reviews every report within 30 minutes."},
    {"title": "VPN client setup (Windows + Mac)", "category": "Networking",
     "summary": "Connecting to the corporate network from home or while traveling.",
     "body": "Download the FortiClient VPN, install with default settings, and enter the connection profile your IT contact provided."},
]


async def seed_content():
    if await repositories.blog_posts.count_documents({}) == 0:
        for p in SEED_BLOG:
            await repositories.blog_posts.insert_one(BlogPost(**p).model_dump())
        logger.info(f"Seeded {len(SEED_BLOG)} blog posts")
    if await repositories.kb_articles.count_documents({}) == 0:
        for a in SEED_KB:
            await repositories.kb_articles.insert_one(KBArticle(**a).model_dump())
        logger.info(f"Seeded {len(SEED_KB)} KB articles")


# ---------- App wiring ----------
app.include_router(api_router)
app.include_router(auth_router)
app.include_router(tickets_router)
app.include_router(kb_router)
app.include_router(blog_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


@app.on_event("startup")
async def on_startup():
    await repositories.users.create_index("email", unique=True)
    await repositories.tickets.create_index("user_id")
    await repositories.tickets.create_index("created_at")
    await repositories.blog_posts.create_index("created_at")
    await repositories.kb_articles.create_index("created_at")
    await seed_users()
    await seed_content()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
