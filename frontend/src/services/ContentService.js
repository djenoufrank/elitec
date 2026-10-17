import { api } from "./ApiClient";

/** Blog and knowledge-base operations shared by public and admin screens. */
class ContentService {
  listBlogPosts() { return api.get("/blog"); }
  listAllBlogPosts() { return api.get("/blog/all"); }
  createBlogPost(post) { return api.post("/blog", post); }
  updateBlogPost(id, post) { return api.put(`/blog/${id}`, post); }
  deleteBlogPost(id) { return api.delete(`/blog/${id}`); }

  listKnowledgeBaseArticles() { return api.get("/kb"); }
  createKnowledgeBaseArticle(article) { return api.post("/kb", article); }
  updateKnowledgeBaseArticle(id, article) { return api.put(`/kb/${id}`, article); }
  deleteKnowledgeBaseArticle(id) { return api.delete(`/kb/${id}`); }
}

export const contentService = new ContentService();
