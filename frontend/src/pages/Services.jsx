import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SERVICE_CATEGORIES } from "@/lib/data";
import { useT } from "@/lib/i18n";

export default function Services() {
  const { t } = useT();
  return (
    <div>
      <section className="py-20 elitec-hero-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-wider text-[#0057B8] font-semibold mb-3">{t("services.kicker")}</p>
          <h1 data-testid="services-headline" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
            {t("services.headline")}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">{t("services.sub")}</p>
          <div className="mt-7 flex gap-3 flex-wrap">
            <Link to="/calculator"><Button data-testid="services-calc-btn" className="bg-[#0057B8] hover:bg-[#004a9c] text-white">{t("services.calc")} <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link to="/contact"><Button data-testid="services-contact-btn" variant="outline">{t("services.quote")}</Button></Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {SERVICE_CATEGORIES.map((s, idx) => {
            const Icon = s.icon;
            const isAlt = idx % 2 === 1;
            return (
              <Card key={s.id} data-testid={`service-detail-${s.id}`} className="border-border overflow-hidden">
                <CardContent className={`p-8 lg:p-10 grid lg:grid-cols-3 gap-8 ${isAlt ? "lg:[direction:rtl]" : ""}`}>
                  <div className="lg:[direction:ltr] flex flex-col">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0057B8] to-[#00A3E0] flex items-center justify-center text-white mb-5">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t(s.titleKey)}</h2>
                    <p className="mt-2 text-muted-foreground">{t(s.taglineKey)}</p>
                    <Link to="/contact" className="mt-6">
                      <Button variant="outline" className="border-[#0057B8] text-[#0057B8] hover:bg-[#0057B8]/5">
                        {t("services.discuss")} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <ul className="lg:[direction:ltr] lg:col-span-2 grid sm:grid-cols-2 gap-3 content-start">
                    {s.items.map((k) => (
                      <li key={k} className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40 border border-border">
                        <CheckCircle2 className="h-5 w-5 text-[#00C389] mt-0.5 shrink-0" />
                        <span className="text-sm font-medium">{t(k)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
