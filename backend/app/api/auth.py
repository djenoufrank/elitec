from fastapi import APIRouter, Depends, HTTPException
from app.database import repositories, get_current_user
from app.schemas import AuthOut, LoginIn, RegisterIn, UserOut
from auth import hash_password, verify_password, create_access_token
import uuid
from app.schemas import now_iso

# ---------- Auth Routes ----------
auth_router = APIRouter(prefix="/api/auth")


@auth_router.post("/register", response_model=AuthOut)
async def register(payload: RegisterIn):
    email = payload.email.lower().strip()
    if await repositories.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    user_doc = {
        "id": str(uuid.uuid4()),
        "email": email,
        "name": payload.name,
        "company": payload.company,
        "role": "customer",
        "password_hash": hash_password(payload.password),
        "created_at": now_iso(),
    }
    await repositories.users.insert_one(user_doc)
    token = create_access_token(user_doc["id"], email, "customer")
    user_doc.pop("password_hash", None)
    user_doc.pop("_id", None)
    return AuthOut(token=token, user=UserOut(**user_doc))


@auth_router.post("/login", response_model=AuthOut)
async def login(payload: LoginIn):
    email = payload.email.lower().strip()
    user = await repositories.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], email, user["role"])
    user.pop("password_hash", None)
    user.pop("_id", None)
    return AuthOut(token=token, user=UserOut(**user))


@auth_router.get("/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return UserOut(**user)
