from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.database import repositories, require_admin
from app.schemas import KBArticle, KBArticleIn, now_iso

# ---------- KB ----------
kb_router = APIRouter(prefix="/api/kb")


@kb_router.get("", response_model=List[KBArticle])
async def list_kb():
    docs = await repositories.kb_articles.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@kb_router.get("/{article_id}", response_model=KBArticle)
async def get_kb(article_id: str):
    doc = await repositories.kb_articles.find_one({"id": article_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Article not found")
    return doc


@kb_router.post("", response_model=KBArticle)
async def create_kb(payload: KBArticleIn, _: dict = Depends(require_admin)):
    article = KBArticle(**payload.model_dump())
    await repositories.kb_articles.insert_one(article.model_dump())
    return article


@kb_router.put("/{article_id}", response_model=KBArticle)
async def update_kb(article_id: str, payload: KBArticleIn, _: dict = Depends(require_admin)):
    res = await repositories.kb_articles.update_one(
        {"id": article_id},
        {"$set": {**payload.model_dump(), "updated_at": now_iso()}},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return await repositories.kb_articles.find_one({"id": article_id}, {"_id": 0})


@kb_router.delete("/{article_id}")
async def delete_kb(article_id: str, _: dict = Depends(require_admin)):
    res = await repositories.kb_articles.delete_one({"id": article_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"ok": True}
