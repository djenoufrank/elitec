import { useT } from "@/lib/i18n";
import PageHeroMedia from "@/components/layout/PageHeroMedia";

export default function Offers() {
  const { t } = useT();

  return (
    <section className="site-page-hero">
      <PageHeroMedia />
      <div className="site-page-hero__content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-sm uppercase tracking-wider text-[#9bd4ff] font-semibold mb-3">
          {t("offers.kicker")}
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl text-white">
          {t("offers.title")}
        </h1>
        <p className="mt-5 text-lg text-white/85 max-w-2xl">
          {t("offers.description")}
        </p>
      </div>
    </section>
  );
}