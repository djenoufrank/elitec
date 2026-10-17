import { Link } from "react-router-dom";
import { TrendingUp, Target, Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CASE_STUDIES } from "@/lib/data";
import { useT } from "@/lib/i18n";

export default function CaseStudies() {
  const { t } = useT();
  return (
    <div>
      <section className="py-20 elitec-hero-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-wider text-[#0057B8] font-semibold mb-3">{t("case.kicker")}</p>
          <h1 data-testid="cases-headline" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
            {t("case.headline")}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">{t("case.sub")}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {CASE_STUDIES.map((c) => (
            <Card key={c.id} data-testid={`case-${c.id}`} className="border-border overflow-hidden">
              <CardContent className="p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="px-3 py-1 rounded-full bg-[#00C389]/10 text-[#00C389] text-xs font-semibold uppercase tracking-wider">{t(c.industryKey)}</span>
                  <span className="px-3 py-1 rounded-full bg-[#0057B8]/10 text-[#0057B8] text-xs font-semibold">{t(c.roiKey)}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t(c.clientKey)}</h2>
                <div className="mt-6 grid lg:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <Target className="h-4 w-4 text-[#0057B8]" /> {t("case.challenge")}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(c.challengeKey)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <Wrench className="h-4 w-4 text-[#0057B8]" /> {t("case.solution")}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(c.solutionKey)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <TrendingUp className="h-4 w-4 text-[#00C389]" /> {t("case.results")}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(c.resultsKey)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t("case.cta.title")}</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">{t("case.cta.sub")}</p>
          <Link to="/contact" className="inline-block mt-7">
            <Button data-testid="cases-cta" size="lg" className="bg-[#0057B8] hover:bg-[#004a9c] text-white h-12 px-6">
              {t("case.cta.button")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
