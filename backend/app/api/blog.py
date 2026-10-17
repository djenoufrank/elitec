from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.database import repositories, require_admin
from app.schemas import BlogPost, BlogPostIn, now_iso

# ---------- Blog ----------
blog_router = APIRouter(prefix="/api/blog")


@blog_router.get("", response_model=List[BlogPost])
async def list_blog():
    docs = await repositories.blog_posts.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@blog_router.get("/all", response_model=List[BlogPost])
async def list_blog_all(_: dict = Depends(require_admin)):
    docs = await repositories.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@blog_router.get("/{post_id}", response_model=BlogPost)
async def get_blog(post_id: str):
    doc = await repositories.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    return doc


@blog_router.post("", response_model=BlogPost)
async def create_blog(payload: BlogPostIn, _: dict = Depends(require_admin)):
    post = BlogPost(**payload.model_dump())
    await repositories.blog_posts.insert_one(post.model_dump())
    return post


@blog_router.put("/{post_id}", response_model=BlogPost)
async def update_blog(post_id: str, payload: BlogPostIn, _: dict = Depends(require_admin)):
    res = await repositories.blog_posts.update_one(
        {"id": post_id},
        {"$set": {**payload.model_dump(), "updated_at": now_iso()}},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return await repositories.blog_posts.find_one({"id": post_id}, {"_id": 0})


@blog_router.delete("/{post_id}")
async def delete_blog(post_id: str, _: dict = Depends(require_admin)):
    res = await repositories.blog_posts.delete_one({"id": post_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"ok": True}
