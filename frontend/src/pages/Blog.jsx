import { useEffect, useMemo, useState } from "react";
import { Search, Clock, Tag, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { contentService } from "@/services/ContentService";
import { useT } from "@/lib/i18n";
import PageHeroMedia from "@/components/layout/PageHeroMedia";

export default function Blog() {
  const { t } = useT();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState(null);

  useEffect(() => {
    contentService.listBlogPosts().then(({ data }) => setPosts(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = cat === "All" || p.category === cat;
      const matchQ = !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [posts, q, cat]);

  const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div>
      <section className="site-page-hero">
        <PageHeroMedia />
        <div className="site-page-hero__content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <p className="text-sm uppercase tracking-wider text-[#b6e4ff] font-semibold mb-3">{t("blog.kicker")}</p>
          <h1 data-testid="blog-headline" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl text-white">
            {t("blog.headline")}
          </h1>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input data-testid="blog-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("blog.search")}
                className="w-full h-11 pl-10 pr-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#0057B8]" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} data-testid={`blog-cat-${c}`} onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  cat === c ? "bg-[#0057B8] text-white border-[#0057B8]" : "bg-background text-[#1f2937] border-border hover:border-[#0057B8] hover:text-[#0057B8]"
                }`}>
                {c === "All" ? t("common.all") : c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-[#0057B8]" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">{t("common.noResults")}</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <Card key={p.id} data-testid={`blog-card-${p.id}`} onClick={() => setActive(p)} className="card-lift border-border overflow-hidden group cursor-pointer">
                  <div className="h-40 bg-gradient-to-br from-[#0057B8] via-[#00A3E0] to-[#00C389] flex items-center justify-center text-white">
                    {p.cover_url ? <img src={p.cover_url} alt="" className="w-full h-full object-cover" /> : <Tag className="h-10 w-10 opacity-80" />}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-[#0057B8]/10 text-[#0057B8] font-medium">{p.category}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.read_time || "5 min"}</span>
                      <span>{fmtDate(p.created_at)}</span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug group-hover:text-[#0057B8] transition-colors">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
                    <button className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#0057B8]">
                      {t("common.readArticle")} <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!active} onOpenChange={() => setActive(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {active && (
            <>
              <DialogHeader>
                <span className="text-xs px-2 py-0.5 rounded bg-[#0057B8]/10 text-[#0057B8] font-medium w-fit">{active.category}</span>
                <DialogTitle data-testid="blog-detail-title" className="text-2xl">{active.title}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">{fmtDate(active.created_at)} · {active.read_time}</p>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{active.body}</div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
