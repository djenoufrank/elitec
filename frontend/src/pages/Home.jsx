import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Shield, Clock, Award, Wallet, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SERVICE_CATEGORIES, PARTNERS, TESTIMONIALS, WHY_ELITEC } from "@/lib/data";
import PageHeroMedia from "@/components/layout/PageHeroMedia";
import { useT } from "@/lib/i18n";

const WhyIcons = { Clock, Award, Wallet, Zap };

export default function Home() {
  const { t } = useT();
  return (
    <div>
      {/* Hero */}
      <section className="site-page-hero">
        <PageHeroMedia />
        <div className="site-page-hero__content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#b6e4ff] text-xs font-medium mb-6" data-testid="hero-badge">
              <Shield className="h-3.5 w-3.5" /> {t("home.badge")}
            </div>
            <h1 data-testid="hero-headline" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-white">
              {t("home.hero.title1")} <span className="elitec-gradient-text">{t("home.hero.title2")}</span>
            </h1>
            <p data-testid="hero-subhead" className="mt-6 text-lg text-white/85 max-w-xl leading-relaxed">
              {t("home.hero.sub")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/contact">
                <Button data-testid="hero-cta-consultation" size="lg" className="bg-[#0057B8] hover:bg-[#004a9c] text-white h-12 px-6">
                  {t("home.cta.consult")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/calculator">
                <Button data-testid="hero-cta-calculator" size="lg" variant="outline" className="h-12 px-6 bg-white/95 border-white text-[#0057B8] hover:bg-white">
                  {t("home.cta.calc")}
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[['10+', t("home.stats.years")],['95.5%', t("home.stats.clients")],['99.9%', t("home.stats.uptime")]].map(([n,l]) => (
                <div key={l} className="text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-[#b6e4ff]">{n}</div>
                  <div className="text-xs uppercase tracking-wider text-white/70">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Elitec */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-wider text-[#0057B8] font-semibold mb-3">{t("home.why.kicker")}</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t("home.why.title")}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t("home.why.desc")}</p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_ELITEC.map((w) => {
              const Icon = WhyIcons[w.icon] || Award;
              return (
                <Card key={w.titleKey} data-testid={`why-card-${w.titleKey}`} className="card-lift border-border">
                  <CardContent className="p-6">
                    <div className="h-11 w-11 rounded-lg bg-[#0057B8]/10 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-[#0057B8]" />
                    </div>
                    <h3 className="text-lg font-semibold">{t(w.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{t(w.descKey)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-wider text-[#0057B8] font-semibold mb-3">{t("home.services.kicker")}</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t("home.services.title")}</h2>
            </div>
            <Link to="/services" data-testid="view-all-services">
              <Button variant="outline" className="border-[#0057B8] text-[#0057B8] hover:bg-[#0057B8]/5">{t("home.services.viewAll")} <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.slice(0, 6).map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.id} data-testid={`service-card-${s.id}`} className="card-lift border-border">
                  <CardContent className="p-6">
                    <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-[#0057B8] to-[#00A3E0] flex items-center justify-center mb-4 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{t(s.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5">{t(s.taglineKey)}</p>
                    <ul className="mt-4 space-y-1.5 text-sm">
                      {s.items.slice(0, 4).map((k) => (
                        <li key={k} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-[#00C389] mt-0.5 shrink-0" /> {t(k)}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm uppercase tracking-wider text-muted-foreground mb-8">{t("home.partners")}</p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 items-center">
            {PARTNERS.map((p) => (
              <span key={p} className="text-base sm:text-lg font-semibold text-muted-foreground/70 hover:text-[#0057B8] transition-colors">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-sm uppercase tracking-wider text-[#0057B8] font-semibold mb-3">{t("home.testimonials.kicker")}</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t("home.testimonials.title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((tst, idx) => (
              <Card key={idx} data-testid={`testimonial-${idx}`} className="border-border">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 text-[#00C389] mb-4">
                    {[0,1,2,3,4].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-sm leading-relaxed">"{t(tst.quoteKey)}"</p>
                  <div className="mt-5 pt-5 border-t border-border">
                    <p className="font-semibold text-sm">{t(tst.nameKey)}</p>
                    <p className="text-xs text-muted-foreground">{t(tst.roleKey)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#0057B8] via-[#0057B8] to-[#00A3E0] p-10 lg:p-14 text-white relative">
            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t("home.cta.ready")}</h2>
                <p className="mt-3 text-white/85 max-w-lg">{t("home.cta.readySub")}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
                <Link to="/contact">
                  <Button data-testid="cta-strip-assessment" size="lg" className="bg-white text-[#0057B8] hover:bg-white/90 h-12 px-6">
                    {t("home.cta.assessment")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/calculator">
                  <Button data-testid="cta-strip-calc" size="lg" variant="outline" className="h-12 px-6 bg-transparent border-white text-white hover:bg-white/10">
                    {t("home.cta.calcShort")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
