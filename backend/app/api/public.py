import asyncio
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.database import repositories, require_admin
from app.email_service import send_contact_message_email, send_quote_request_email
from app.schemas import (
    CalculatorLeadStart, Contact, ContactCreate, Quote, QuoteCreate,
    QuoteEstimateUpdate, now_iso,
)

api_router = APIRouter(prefix="/api")
logger = logging.getLogger("elitec.api")

# ---------- Public Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Elitec API is running", "version": "2.0"}


@api_router.post("/contact")
async def create_contact(payload: ContactCreate):
    contact = Contact(**payload.model_dump())
    await repositories.contacts.insert_one(contact.model_dump())
    if payload.quote_id:
        await repositories.quotes.update_one(
            {"id": payload.quote_id},
            {"$set": {"contact_requested": True, "contact_requested_at": now_iso()}},
        )

    try:
        email_sent = await asyncio.to_thread(
            send_contact_message_email,
            contact.model_dump(),
        )
    except Exception:
        logger.exception("Could not send contact message notification")
        email_sent = False

    await repositories.contacts.update_one(
        {"id": contact.id},
        {"$set": {
            "email_sent": email_sent,
            "email_sent_at": now_iso() if email_sent else None,
        }},
    )
    return {"ok": True, "email_sent": email_sent}

@api_router.get("/contact", response_model=List[Contact])
async def list_contacts(_: dict = Depends(require_admin)):
    docs = await repositories.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.post("/quote", response_model=Quote)
async def save_quote(payload: QuoteCreate):
    quote = Quote(**payload.model_dump())
    await repositories.quotes.insert_one(quote.model_dump())
    return quote


@api_router.post("/quote/leads", response_model=Quote)
async def start_calculator_lead(payload: CalculatorLeadStart):
    first_name = payload.first_name.strip()
    last_name = payload.last_name.strip()
    if not first_name or not last_name:
        raise HTTPException(status_code=422, detail="First and last name are required")
    lead = Quote(
        first_name=first_name,
        last_name=last_name,
        name=f"{first_name} {last_name}",
        email=payload.email,
        users=50,
        support_level="Standard",
        cloud_services=["Microsoft 365", "Backup"],
        security_services=["Entra ID + MFA", "Conditional Access", "Endpoint Protection"],
        servers=4,
        workstations=50,
        network_devices=8,
        support_coverage="Business hours",
        monthly_total=0,
        annual_total=0,
        breakdown={},
        completed=False,
        contact_requested=False,
        company_email_sent=False,
    )
    await repositories.quotes.insert_one(lead.model_dump())
    return lead


@api_router.patch("/quote/{quote_id}")
async def update_calculator_lead(quote_id: str, payload: QuoteEstimateUpdate):
    result = await repositories.quotes.update_one(
        {"id": quote_id, "completed": False},
        {"$set": payload.model_dump()},
    )
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Active estimate not found")
    return {"ok": True}


@api_router.post("/quote/{quote_id}/complete")
async def complete_calculator_lead(quote_id: str, payload: QuoteEstimateUpdate):
    lead = await repositories.quotes.find_one({"id": quote_id})
    if lead is None:
        raise HTTPException(status_code=404, detail="Estimate not found")
    if lead.get("company_email_sent"):
        return {"ok": True, "email_sent": True}

    result = await repositories.quotes.update_one(
        {"id": quote_id},
        {"$set": {
            **payload.model_dump(),
            "completed": True,
            "completed_at": now_iso(),
            "contact_requested": True,
            "contact_requested_at": now_iso(),
        }},
    )
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Estimate not found")

    try:
        email_sent = await asyncio.to_thread(
            send_quote_request_email,
            {**lead, "first_name": lead.get("first_name", ""), "last_name": lead.get("last_name", "")},
            payload.model_dump(),
        )
    except Exception:
        logger.exception("Could not send quote request notification")
        email_sent = False

    if email_sent:
        await repositories.quotes.update_one(
            {"id": quote_id},
            {"$set": {"company_email_sent": True, "company_email_sent_at": now_iso()}},
        )
    return {"ok": True, "email_sent": email_sent}


