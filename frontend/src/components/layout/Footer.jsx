import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/data";
import { useT } from "@/lib/i18n";

export default function Footer() {
  const { t } = useT();
  return (
    <footer data-testid="site-footer" className="border-t border-border bg-muted/30 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img src={COMPANY.logo} alt="Elitec" className="h-20 w-auto" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {t("foot.tagline")}
          </p>
          <div className="flex gap-3 mt-5">
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="h-9 w-9 rounded-md border border-border inline-flex items-center justify-center hover:bg-muted" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
            <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-md border border-border inline-flex items-center justify-center hover:bg-muted" aria-label="WhatsApp"><MessageCircle className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground/70">{t("foot.services")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-[#0057B8]">{t("svc.managed.title")}</Link></li>
            <li><Link to="/services" className="hover:text-[#0057B8]">{t("svc.cloud.title")}</Link></li>
            <li><Link to="/services" className="hover:text-[#0057B8]">{t("svc.identity.title")}</Link></li>
            <li><Link to="/services" className="hover:text-[#0057B8]">{t("svc.workplace.title")}</Link></li>
            <li><Link to="/services" className="hover:text-[#0057B8]">{t("svc.continuity.title")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground/70">{t("foot.company")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-[#0057B8]">{t("nav.about")}</Link></li>
            <li><Link to="/industries" className="hover:text-[#0057B8]">{t("nav.industries")}</Link></li>
            <li><Link to="/case-studies" className="hover:text-[#0057B8]">{t("nav.cases")}</Link></li>
            <li><Link to="/blog" className="hover:text-[#0057B8]">{t("nav.blog")}</Link></li>
            <li><Link to="/calculator" className="hover:text-[#0057B8]">{t("nav.calculator")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground/70">{t("foot.contact")}</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-[#0057B8] shrink-0" /> <a href={`tel:${COMPANY.phoneRaw}`} className="hover:text-[#0057B8]">{COMPANY.phone}</a></li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-[#0057B8] shrink-0" /> <a href={`mailto:${COMPANY.email}`} className="hover:text-[#0057B8]">{COMPANY.email}</a></li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-[#0057B8] shrink-0" /> <span>Rue Charles Heuze 38<br />5060 Auvelais, Belgique</span></li>
            <li className="text-xs">{t("foot.tva")}: {COMPANY.tva}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Elitec. {t("foot.rights")}</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#0057B8]">{t("foot.privacy")}</a>
            <a href="#" className="hover:text-[#0057B8]">{t("foot.terms")}</a>
            <a href="#" className="hover:text-[#0057B8]">{t("foot.gdpr")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
