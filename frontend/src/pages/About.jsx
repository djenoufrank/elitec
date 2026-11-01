import { Link } from "react-router-dom";
import { Target, Eye, Heart, Users, Award, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageHeroMedia from "@/components/layout/PageHeroMedia";
import { useT } from "@/lib/i18n";

const VALUES = [
  { icon: Heart, tKey: "about.v.customer" },
  { icon: Award, tKey: "about.v.excellence" },
  { icon: Globe, tKey: "about.v.integrity" },
  { icon: Users, tKey: "about.v.partnership" },
];

export default function About() {
  const { t } = useT();
  const EXPERTISE = [
    t("about.exp.1"), t("about.exp.2"), t("about.exp.3"),
    t("about.exp.4"), t("about.exp.5"), t("about.exp.6"),
  ];

  return (
    <div>
      <section className="site-page-hero">
        <PageHeroMedia />
        <div className="site-page-hero__content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-wider text-[#b6e4ff] font-semibold mb-3">{t("about.kicker")}</p>
            <h1 data-testid="about-headline" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-white">
              {t("about.headline")}
            </h1>
            <p className="mt-6 text-lg text-white/85 leading-relaxed max-w-xl">
              {t("about.sub")}
            </p>
            <div className="mt-8 flex gap-3 flex-wrap">
              <Link to="/contact"><Button data-testid="about-contact-btn" className="bg-[#0057B8] hover:bg-[#004a9c] text-white">{t("about.cta.contact")}</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
          {[
            { icon: Target, k: "about.mission" },
            { icon: Eye, k: "about.vision" },
            { icon: Heart, k: "about.promise" },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.k} className="card-lift border-border">
                <CardContent className="p-7">
                  <Icon className="h-7 w-7 text-[#0057B8] mb-4" />
                  <h3 className="text-xl font-semibold">{t(`${b.k}.t`)}</h3>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{t(`${b.k}.d`)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-sm uppercase tracking-wider text-[#0057B8] font-semibold mb-3">{t("about.values.kicker")}</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t("about.values.title")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.tKey} className="bg-background border border-border rounded-xl p-6 card-lift">
                  <Icon className="h-6 w-6 text-[#00C389] mb-4" />
                  <p className="font-semibold">{t(`${v.tKey}.t`)}</p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{t(`${v.tKey}.d`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-wider text-[#0057B8] font-semibold mb-3">{t("about.exp.kicker")}</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t("about.exp.title")}</h2>
              <p className="mt-5 text-muted-foreground leading-relaxed max-w-lg">{t("about.exp.sub")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXPERTISE.map((c) => (
                <div key={c} className="border border-border rounded-lg p-4 text-sm font-medium bg-muted/30">{c}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
