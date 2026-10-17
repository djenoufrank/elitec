"""Validated request and response shapes used by the HTTP API."""
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    phone: Optional[str] = None
    service: Optional[str] = None
    message: str


class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    service: Optional[str] = None
    message: str
    created_at: str = Field(default_factory=now_iso)


class QuoteCreate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    users: int
    support_level: str
    cloud_services: List[str] = Field(default_factory=list)
    security_services: List[str] = Field(default_factory=list)
    servers: int = 0
    workstations: int = 0
    network_devices: int = 0
    support_coverage: str
    monthly_total: float
    annual_total: float
    breakdown: dict


class Quote(QuoteCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)


class RegisterIn(BaseModel):
    email: EmailStr
    password: str
    name: str
    company: Optional[str] = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str
    company: Optional[str] = None
    created_at: str


class AuthOut(BaseModel):
    token: str
    user: UserOut


class TicketCreate(BaseModel):
    subject: str
    description: str
    priority: str = "Medium"
    category: str = "General"


class TicketComment(BaseModel):
    body: str


class Ticket(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_email: str
    user_name: str
    subject: str
    description: str
    priority: str
    category: str
    status: str = "Open"
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)
    comments: List[dict] = Field(default_factory=list)


class TicketStatusUpdate(BaseModel):
    status: str


class KBArticleIn(BaseModel):
    title: str
    category: str
    summary: str
    body: str
    published: bool = True


class KBArticle(KBArticleIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


class BlogPostIn(BaseModel):
    title: str
    category: str
    excerpt: str
    body: str
    cover_url: Optional[str] = None
    read_time: str = "5 min"
    published: bool = True


class BlogPost(BlogPostIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)
