from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException
from app.database import repositories, get_current_user, require_admin
from app.schemas import Ticket, TicketCreate, TicketComment, TicketStatusUpdate, now_iso

# ---------- Tickets ----------
tickets_router = APIRouter(prefix="/api/tickets")


@tickets_router.get("", response_model=List[Ticket])
async def list_tickets(user: dict = Depends(get_current_user)):
    query = {} if user["role"] == "admin" else {"user_id": user["id"]}
    docs = await repositories.tickets.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@tickets_router.post("", response_model=Ticket)
async def create_ticket(payload: TicketCreate, user: dict = Depends(get_current_user)):
    ticket = Ticket(
        user_id=user["id"], user_email=user["email"], user_name=user["name"],
        **payload.model_dump(),
    )
    await repositories.tickets.insert_one(ticket.model_dump())
    return ticket


@tickets_router.get("/{ticket_id}", response_model=Ticket)
async def get_ticket(ticket_id: str, user: dict = Depends(get_current_user)):
    doc = await repositories.tickets.find_one({"id": ticket_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if user["role"] != "admin" and doc["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return doc


@tickets_router.post("/{ticket_id}/comments", response_model=Ticket)
async def add_comment(ticket_id: str, payload: TicketComment, user: dict = Depends(get_current_user)):
    doc = await repositories.tickets.find_one({"id": ticket_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if user["role"] != "admin" and doc["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    comment = {
        "id": str(uuid.uuid4()),
        "author_name": user["name"],
        "author_role": user["role"],
        "body": payload.body,
        "created_at": now_iso(),
    }
    await repositories.tickets.update_one(
        {"id": ticket_id},
        {"$push": {"comments": comment}, "$set": {"updated_at": now_iso()}},
    )
    return await repositories.tickets.find_one({"id": ticket_id}, {"_id": 0})


@tickets_router.patch("/{ticket_id}/status", response_model=Ticket)
async def update_status(ticket_id: str, payload: TicketStatusUpdate, _: dict = Depends(require_admin)):
    if payload.status not in ["Open", "In Progress", "Resolved", "Closed"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    res = await repositories.tickets.update_one(
        {"id": ticket_id},
        {"$set": {"status": payload.status, "updated_at": now_iso()}},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return await repositories.tickets.find_one({"id": ticket_id}, {"_id": 0})
