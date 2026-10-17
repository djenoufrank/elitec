from typing import List
from fastapi import APIRouter, Depends
from app.database import repositories, require_admin
from app.schemas import Contact, ContactCreate, Quote, QuoteCreate

api_router = APIRouter(prefix="/api")

# ---------- Public Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Elitec API is running", "version": "2.0"}


@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    contact = Contact(**payload.model_dump())
    await repositories.contacts.insert_one(contact.model_dump())
    return contact


@api_router.get("/contact", response_model=List[Contact])
async def list_contacts(_: dict = Depends(require_admin)):
    docs = await repositories.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.post("/quote", response_model=Quote)
async def save_quote(payload: QuoteCreate):
    quote = Quote(**payload.model_dump())
    await repositories.quotes.insert_one(quote.model_dump())
    return quote


