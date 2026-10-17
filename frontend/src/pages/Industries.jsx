import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { INDUSTRIES } from "@/lib/data";
import { useT } from "@/lib/i18n";

const HIGHLIGHT_KEYS = {
  manufacturing: ["ind.h.manufacturing.1", "ind.h.manufacturing.2", "ind.h.manufacturing.3"],
  retail: ["ind.h.retail.1", "ind.h.retail.2", "ind.h.retail.3"],
  logistics: ["ind.h.logistics.1", "ind.h.logistics.2", "ind.h.logistics.3"],
  education: ["ind.h.education.1", "ind.h.education.2", "ind.h.education.3"],
  professional: ["ind.h.professional.1", "ind.h.professional.2", "ind.h.professional.3"],
};

export default function Industries() {
  const { t } = useT();
  return (
    <div>
      <section className="py-20 elitec-hero-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-wider text-[#0057B8] font-semibold mb-3">{t("home.industries.kicker")}</p>
          <h1 data-testid="industries-headline" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
            {t("ind.detail.title")}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            {t("home.industries.title")}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {INDUSTRIES.map((i) => {
            const Icon = i.icon;
            return (
              <Card key={i.id} data-testid={`industry-detail-${i.id}`} className="card-lift border-border">
                <CardContent className="p-7">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#0057B8]/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-[#0057B8]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{t(i.nameKey)}</h3>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{t(i.blurbKey)}</p>
                      <ul className="mt-4 grid sm:grid-cols-2 gap-1.5">
                        {(HIGHLIGHT_KEYS[i.id] || []).map((k) => (
                          <li key={k} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-[#00C389] mt-0.5 shrink-0" /> {t(k)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-[#0057B8] to-[#00A3E0] p-10 lg:p-14 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("ind.cta.title")}</h2>
              <p className="mt-2 text-white/85">{t("ind.cta.sub")}</p>
            </div>
            <Link to="/contact">
              <Button data-testid="industries-cta" size="lg" className="bg-white text-[#0057B8] hover:bg-white/90 h-12 px-6">
                {t("ind.cta.button")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
