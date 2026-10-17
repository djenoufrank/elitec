import { useEffect, useState } from "react";
import { Ticket, BookOpen, Plus, MessageSquare, Loader2, ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatApiError } from "@/services/ApiClient";
import { ticketService } from "@/services/TicketService";
import { contentService } from "@/services/ContentService";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";

const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const CATEGORIES = ["General", "Hardware", "Software", "Network", "Email", "Security", "Cloud / M365"];
const STATUS_COLOR = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Closed: "bg-gray-100 text-gray-700",
};
const PRIO_COLOR = {
  Low: "bg-gray-100 text-gray-700",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

export default function Portal() {
  const { t } = useT();
  const { user } = useAuth();
  const [tab, setTab] = useState("tickets");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOpen, setNewOpen] = useState(false);
  const [detailTicket, setDetailTicket] = useState(null);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const { data } = await ticketService.listTickets();
      setTickets(data);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTickets(); }, []);

  return (
    <div className="min-h-[70vh]">
      <section className="py-10 elitec-hero-grid border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-wider text-[#0057B8] font-semibold mb-2">{t("nav.portal")}</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{t("portal.welcome")}, {user?.name}</h1>
          <p className="text-muted-foreground mt-1.5">{user?.company} · {user?.email}</p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6 border-b border-border">
            {[
              { id: "tickets", icon: Ticket, label: t("portal.tickets") },
              { id: "kb", icon: BookOpen, label: t("portal.kb") },
            ].map((tb) => {
              const Icon = tb.icon;
              return (
                <button
                  key={tb.id}
                  data-testid={`portal-tab-${tb.id}`}
                  onClick={() => setTab(tb.id)}
                  className={`px-4 py-2.5 -mb-px border-b-2 flex items-center gap-2 text-sm font-medium transition ${
                    tab === tb.id ? "border-[#0057B8] text-[#0057B8]" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {tb.label}
                </button>
              );
            })}
          </div>

          {tab === "tickets" && (
            <TicketsTab
              tickets={tickets}
              loading={loading}
              onCreate={() => setNewOpen(true)}
              onOpen={setDetailTicket}
            />
          )}
          {tab === "kb" && <KBTab />}
        </div>
      </section>

      <NewTicketDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        onCreated={() => { setNewOpen(false); loadTickets(); }}
      />
      <TicketDetailDialog
        ticket={detailTicket}
        onClose={() => setDetailTicket(null)}
        onUpdated={(updated) => {
          setDetailTicket(updated);
          setTickets((ts) => ts.map((x) => (x.id === updated.id ? updated : x)));
        }}
      />
    </div>
  );
}

function TicketsTab({ tickets, loading, onCreate, onOpen }) {
  const { t } = useT();
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">{t("portal.tickets")} ({tickets.length})</h2>
        <Button data-testid="portal-new-ticket-btn" onClick={onCreate} className="bg-[#0057B8] hover:bg-[#004a9c] text-white">
          <Plus className="h-4 w-4 mr-1.5" /> {t("portal.newTicket")}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#0057B8]" /></div>
      ) : tickets.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center text-muted-foreground">
            <Ticket className="h-10 w-10 mx-auto mb-3 text-muted-foreground/60" />
            <p>{t("portal.noTickets")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((tk) => (
            <Card
              key={tk.id}
              data-testid={`ticket-row-${tk.id}`}
              onClick={() => onOpen(tk)}
              className="border-border cursor-pointer card-lift"
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_COLOR[tk.status] || ""}`}>{tk.status}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${PRIO_COLOR[tk.priority] || ""}`}>{tk.priority}</span>
                  <span className="text-xs text-muted-foreground">{tk.category}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{new Date(tk.created_at).toLocaleString()}</span>
                </div>
                <p className="font-semibold">{tk.subject}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tk.description}</p>
                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5" /> {(tk.comments || []).length} comment(s) · by {tk.user_name}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function NewTicketDialog({ open, onOpenChange, onCreated }) {
  const { t } = useT();
  const [form, setForm] = useState({ subject: "", description: "", priority: "Medium", category: "General" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.subject.trim() || !form.description.trim()) {
      toast.error("Subject and description required.");
      return;
    }
    setLoading(true);
    try {
      await ticketService.createTicket(form);
      toast.success(t("portal.ticket.opened"));
      setForm({ subject: "", description: "", priority: "Medium", category: "General" });
      onCreated();
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("portal.newTicket")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("portal.ticket.subject")} *</label>
            <input data-testid="new-ticket-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-[#0057B8]" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("portal.ticket.description")} *</label>
            <textarea data-testid="new-ticket-desc" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-[#0057B8] resize-y" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("portal.ticket.priority")}</label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger data-testid="new-ticket-priority" className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("portal.ticket.category")}</label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger data-testid="new-ticket-category" className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
          <Button data-testid="new-ticket-submit" disabled={loading} onClick={submit} className="bg-[#0057B8] hover:bg-[#004a9c] text-white">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("portal.ticket.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TicketDetailDialog({ ticket, onClose, onUpdated }) {
  const { t } = useT();
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  if (!ticket) return null;

  const addComment = async () => {
    if (!comment.trim()) return;
    setSending(true);
    try {
      const { data } = await ticketService.addComment(ticket.id, comment);
      onUpdated(data);
      setComment("");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSending(false);
    }
  };

  const changeStatus = async (status) => {
    try {
      const { data } = await ticketService.updateStatus(ticket.id, status);
      onUpdated(data);
      toast.success("Status updated");
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  return (
    <Dialog open={!!ticket} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_COLOR[ticket.status] || ""}`}>{ticket.status}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${PRIO_COLOR[ticket.priority] || ""}`}>{ticket.priority}</span>
            <span className="text-xs text-muted-foreground">{ticket.category}</span>
          </div>
          <DialogTitle data-testid="ticket-detail-subject">{ticket.subject}</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-sm text-muted-foreground">
            By {ticket.user_name} · {new Date(ticket.created_at).toLocaleString()}
          </p>
          <p className="mt-3 whitespace-pre-wrap">{ticket.description}</p>

          {user?.role === "admin" && (
            <div className="mt-5 flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Set status:</span>
              {["Open", "In Progress", "Resolved", "Closed"].map((s) => (
                <button
                  key={s}
                  data-testid={`ticket-status-${s}`}
                  onClick={() => changeStatus(s)}
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    ticket.status === s ? "bg-[#0057B8] text-white border-[#0057B8]" : "border-border hover:bg-muted"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">{t("portal.ticket.comments")} ({(ticket.comments || []).length})</h3>
            <div className="space-y-3">
              {(ticket.comments || []).map((c) => (
                <div key={c.id} className={`rounded-lg p-3 ${c.author_role === "admin" ? "bg-[#0057B8]/5 border border-[#0057B8]/20" : "bg-muted/50"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold">
                      {c.author_name}
                      {c.author_role === "admin" && <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded bg-[#0057B8] text-white">Elitec</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</p>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{c.body}</p>
                </div>
              ))}
              {(!ticket.comments || ticket.comments.length === 0) && (
                <p className="text-sm text-muted-foreground italic">No comments yet.</p>
              )}
            </div>

            <div className="mt-4">
              <textarea
                data-testid="ticket-comment-input" rows={3} value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder={t("portal.ticket.addComment")}
                className="w-full px-3 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-[#0057B8] resize-y"
              />
              <Button data-testid="ticket-comment-send" onClick={addComment} disabled={sending || !comment.trim()} className="mt-2 bg-[#0057B8] hover:bg-[#004a9c] text-white">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("common.send")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function KBTab() {
  const { t } = useT();
  const [articles, setArticles] = useState([]);
  const [active, setActive] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    contentService.listKnowledgeBaseArticles().then(({ data }) => setArticles(data)).catch(() => {});
  }, []);

  const filtered = articles.filter((a) =>
    !q || a.title.toLowerCase().includes(q.toLowerCase()) || a.summary.toLowerCase().includes(q.toLowerCase())
  );

  if (active) {
    return (
      <div>
        <button data-testid="kb-back" onClick={() => setActive(null)} className="text-sm text-[#0057B8] flex items-center gap-1 mb-4 hover:underline">
          <ArrowLeft className="h-4 w-4" /> {t("portal.kb")}
        </button>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{active.category}</span>
        <h2 className="text-2xl font-bold mt-1">{active.title}</h2>
        <p className="text-muted-foreground mt-1">{active.summary}</p>
        <div className="prose prose-sm max-w-none mt-5 whitespace-pre-wrap leading-relaxed">{active.body}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative max-w-md mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input data-testid="kb-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search")}
          className="w-full h-10 pl-10 pr-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-[#0057B8]" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((a) => (
          <Card key={a.id} data-testid={`kb-${a.id}`} onClick={() => setActive(a)} className="border-border card-lift cursor-pointer">
            <CardContent className="p-5">
              <span className="text-xs px-2 py-0.5 rounded bg-[#0057B8]/10 text-[#0057B8] font-medium">{a.category}</span>
              <h3 className="font-semibold mt-2">{a.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
