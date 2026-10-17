import { useEffect, useState } from "react";
import { Ticket, FileText, BookOpen, Mail, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatApiError } from "@/services/ApiClient";
import { contentService } from "@/services/ContentService";
import { customerService } from "@/services/CustomerService";
import { ticketService } from "@/services/TicketService";
import { useT } from "@/lib/i18n";

const BLOG_CATS = ["Cybersecurity", "Cloud Computing", "Microsoft Azure", "Microsoft 365", "IT Best Practices", "Digital Transformation"];
const KB_CATS = ["Getting Started", "Microsoft 365", "Cybersecurity", "Networking", "Cloud", "Hardware"];

export default function Admin() {
  const { t } = useT();
  const [tab, setTab] = useState("tickets");

  return (
    <div className="min-h-[70vh]">
      <section className="py-10 elitec-hero-grid border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-wider text-[#0057B8] font-semibold mb-2">{t("nav.admin")}</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{t("admin.title")}</h1>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6 border-b border-border overflow-x-auto">
            {[
              { id: "tickets", icon: Ticket, label: t("admin.tabs.tickets") },
              { id: "blog", icon: FileText, label: t("admin.tabs.blog") },
              { id: "kb", icon: BookOpen, label: t("admin.tabs.kb") },
              { id: "contacts", icon: Mail, label: t("admin.tabs.contacts") },
            ].map((tb) => {
              const Icon = tb.icon;
              return (
                <button key={tb.id} data-testid={`admin-tab-${tb.id}`} onClick={() => setTab(tb.id)}
                  className={`px-4 py-2.5 -mb-px border-b-2 flex items-center gap-2 text-sm font-medium whitespace-nowrap transition ${
                    tab === tb.id ? "border-[#0057B8] text-[#0057B8]" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}>
                  <Icon className="h-4 w-4" /> {tb.label}
                </button>
              );
            })}
          </div>

          {tab === "tickets" && <AdminTickets />}
          {tab === "blog" && <AdminBlog />}
          {tab === "kb" && <AdminKB />}
          {tab === "contacts" && <AdminContacts />}
        </div>
      </section>
    </div>
  );
}

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService.listTickets().then(({ data }) => setTickets(data)).catch((e) => toast.error(formatApiError(e))).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#0057B8]" /></div>;

  const byStatus = tickets.reduce((acc, tk) => { acc[tk.status] = (acc[tk.status] || 0) + 1; return acc; }, {});

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {["Open", "In Progress", "Resolved", "Closed"].map((s) => (
          <Card key={s} className="border-border"><CardContent className="p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s}</p>
            <p className="text-2xl font-bold mt-1">{byStatus[s] || 0}</p>
          </CardContent></Card>
        ))}
      </div>
      <div className="space-y-3">
        {tickets.map((tk) => (
          <Card key={tk.id} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">{tk.status}</span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-700">{tk.priority}</span>
                <span className="text-xs text-muted-foreground">{tk.category}</span>
                <span className="text-xs text-muted-foreground ml-auto">{new Date(tk.created_at).toLocaleString()}</span>
              </div>
              <p className="font-semibold">{tk.subject}</p>
              <p className="text-sm text-muted-foreground mt-1">From: {tk.user_name} ({tk.user_email})</p>
              <p className="text-sm mt-2 line-clamp-2">{tk.description}</p>
            </CardContent>
          </Card>
        ))}
        {tickets.length === 0 && <p className="text-center text-muted-foreground py-10">No tickets yet.</p>}
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">For replies and status updates, open a ticket from the customer portal view or use the API.</p>
    </div>
  );
}

function AdminBlog() {
  const { t } = useT();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    contentService.listAllBlogPosts().then(({ data }) => setPosts(data)).catch((e) => toast.error(formatApiError(e))).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const del = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try { await contentService.deleteBlogPost(id); toast.success("Deleted"); load(); }
    catch (e) { toast.error(formatApiError(e)); }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button data-testid="admin-new-blog" onClick={() => setEditing({})} className="bg-[#0057B8] hover:bg-[#004a9c] text-white">
          <Plus className="h-4 w-4 mr-1.5" /> {t("admin.blog.new")}
        </Button>
      </div>
      {loading ? <Loader2 className="h-6 w-6 animate-spin text-[#0057B8] mx-auto" /> : (
        <div className="space-y-3">
          {posts.map((p) => (
            <Card key={p.id} className="border-border">
              <CardContent className="p-5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-[#0057B8]/10 text-[#0057B8] font-medium">{p.category}</span>
                    {!p.published && <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700">Draft</span>}
                  </div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{p.excerpt}</p>
                </div>
                <div className="flex gap-1.5">
                  <Button data-testid={`blog-edit-${p.id}`} onClick={() => setEditing(p)} variant="outline" size="sm"><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button data-testid={`blog-del-${p.id}`} onClick={() => del(p.id)} variant="outline" size="sm" className="text-red-600 border-red-200"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <BlogEditor post={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
    </div>
  );
}

function BlogEditor({ post, onClose, onSaved }) {
  const isNew = post && !post.id;
  const [form, setForm] = useState({
    title: "", category: BLOG_CATS[0], excerpt: "", body: "", cover_url: "", read_time: "5 min", published: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!post) return;
    setForm({
      title: post.title || "", category: post.category || BLOG_CATS[0],
      excerpt: post.excerpt || "", body: post.body || "",
      cover_url: post.cover_url || "", read_time: post.read_time || "5 min",
      published: post.published !== false,
    });
  }, [post]);

  if (!post) return null;

  const save = async () => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.body.trim()) {
      toast.error("Title, excerpt and body required."); return;
    }
    setSaving(true);
    try {
      if (isNew) await contentService.createBlogPost(form);
      else await contentService.updateBlogPost(post.id, form);
      toast.success("Saved"); onSaved();
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={!!post} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isNew ? "New post" : "Edit post"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <input data-testid="blog-edit-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title"
            className="w-full h-11 px-3 rounded-md border border-border" />
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
            <SelectContent>{BLOG_CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <input value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} placeholder="Cover image URL (optional)"
            className="w-full h-11 px-3 rounded-md border border-border" />
          <input value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} placeholder="Read time (e.g. 5 min)"
            className="w-full h-11 px-3 rounded-md border border-border" />
          <textarea data-testid="blog-edit-excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short excerpt"
            rows={2} className="w-full px-3 py-2 rounded-md border border-border resize-y" />
          <textarea data-testid="blog-edit-body" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Body (markdown supported)"
            rows={8} className="w-full px-3 py-2 rounded-md border border-border resize-y font-mono text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button data-testid="blog-save" disabled={saving} onClick={save} className="bg-[#0057B8] hover:bg-[#004a9c] text-white">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AdminKB() {
  const { t } = useT();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => contentService.listKnowledgeBaseArticles().then(({ data }) => setItems(data)).catch((e) => toast.error(formatApiError(e)));
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm("Delete?")) return;
    try { await contentService.deleteKnowledgeBaseArticle(id); toast.success("Deleted"); load(); } catch (e) { toast.error(formatApiError(e)); }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button data-testid="admin-new-kb" onClick={() => setEditing({})} className="bg-[#0057B8] hover:bg-[#004a9c] text-white">
          <Plus className="h-4 w-4 mr-1.5" /> {t("admin.kb.new")}
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((a) => (
          <Card key={a.id} className="border-border">
            <CardContent className="p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="text-xs px-2 py-0.5 rounded bg-[#00C389]/10 text-[#00C389] font-medium">{a.category}</span>
                <p className="font-semibold mt-1">{a.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{a.summary}</p>
              </div>
              <div className="flex gap-1.5">
                <Button onClick={() => setEditing(a)} variant="outline" size="sm"><Pencil className="h-3.5 w-3.5" /></Button>
                <Button onClick={() => del(a.id)} variant="outline" size="sm" className="text-red-600 border-red-200"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <KBEditor item={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
    </div>
  );
}

function KBEditor({ item, onClose, onSaved }) {
  const isNew = item && !item.id;
  const [form, setForm] = useState({ title: "", category: KB_CATS[0], summary: "", body: "", published: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!item) return;
    setForm({
      title: item.title || "", category: item.category || KB_CATS[0],
      summary: item.summary || "", body: item.body || "", published: item.published !== false,
    });
  }, [item]);

  if (!item) return null;

  const save = async () => {
    if (!form.title.trim() || !form.body.trim()) { toast.error("Title and body required."); return; }
    setSaving(true);
    try {
      if (isNew) await contentService.createKnowledgeBaseArticle(form); else await contentService.updateKnowledgeBaseArticle(item.id, form);
      toast.success("Saved"); onSaved();
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isNew ? "New KB article" : "Edit article"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full h-11 px-3 rounded-md border border-border" />
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
            <SelectContent>{KB_CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="One-line summary" rows={2} className="w-full px-3 py-2 rounded-md border border-border resize-y" />
          <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Article body" rows={8} className="w-full px-3 py-2 rounded-md border border-border resize-y font-mono text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={saving} onClick={save} className="bg-[#0057B8] hover:bg-[#004a9c] text-white">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AdminContacts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    customerService.listContacts().then(({ data }) => setItems(data)).catch((e) => toast.error(formatApiError(e))).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-[#0057B8] mx-auto" />;
  return (
    <div className="space-y-3">
      {items.map((c) => (
        <Card key={c.id} className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold">{c.name} <span className="text-muted-foreground font-normal">· {c.email}</span></p>
              <p className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</p>
            </div>
            {c.company && <p className="text-sm text-muted-foreground">{c.company} {c.phone ? `· ${c.phone}` : ""} {c.service ? `· ${c.service}` : ""}</p>}
            <p className="text-sm mt-2 whitespace-pre-wrap">{c.message}</p>
          </CardContent>
        </Card>
      ))}
      {items.length === 0 && <p className="text-center text-muted-foreground py-10">No messages yet.</p>}
    </div>
  );
}
