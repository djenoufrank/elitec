import { useState } from "react";
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { customerService } from "@/services/CustomerService";
import { COMPANY, SERVICE_CATEGORIES } from "@/lib/data";
import { useT } from "@/lib/i18n";

export default function Contact() {
  const { t } = useT();
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", service: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(t("contact.requiredErr"));
      return;
    }
    setLoading(true);
    try {
      await customerService.sendContactMessage(form);
      setSuccess(true);
      toast.success(t("contact.sendOkToast"));
      setForm({ name: "", email: "", company: "", phone: "", service: "", message: "" });
    } catch {
      toast.error(`${t("contact.sendErrToast")} ${COMPANY.email}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="py-20 elitec-hero-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-wider text-[#0057B8] font-semibold mb-3">{t("contact.kicker")}</p>
          <h1 data-testid="contact-headline" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
            {t("contact.headline")}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">{t("contact.sub")}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          <div className="space-y-5 lg:col-span-1">
            <a href={`tel:${COMPANY.phoneRaw}`} className="block">
              <Card className="border-border card-lift">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="h-11 w-11 rounded-lg bg-[#0057B8]/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-[#0057B8]" />
                  </div>
                  <div>
                    <p className="font-semibold">{t("contact.box.phone.t")}</p>
                    <p className="text-sm">{COMPANY.phone}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("contact.box.phone.s")}</p>
                  </div>
                </CardContent>
              </Card>
            </a>
            <a href={`mailto:${COMPANY.email}`} className="block">
              <Card className="border-border card-lift">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="h-11 w-11 rounded-lg bg-[#0057B8]/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-[#0057B8]" />
                  </div>
                  <div>
                    <p className="font-semibold">{t("contact.box.email.t")}</p>
                    <p className="text-sm">{COMPANY.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("contact.box.email.s")}</p>
                  </div>
                </CardContent>
              </Card>
            </a>
            <Card className="border-border">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="h-11 w-11 rounded-lg bg-[#0057B8]/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-[#0057B8]" />
                </div>
                <div>
                  <p className="font-semibold">{t("contact.box.office.t")}</p>
                  <p className="text-sm">Rue Charles Heuze 38</p>
                  <p className="text-sm">5060 Auvelais, Belgique</p>
                  <p className="text-xs text-muted-foreground mt-0.5">TVA: {COMPANY.tva}</p>
                </div>
              </CardContent>
            </Card>
            <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" className="block">
              <Card className="border-border card-lift">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="h-11 w-11 rounded-lg bg-[#00C389]/15 flex items-center justify-center shrink-0">
                    <MessageCircle className="h-5 w-5 text-[#00C389]" />
                  </div>
                  <div>
                    <p className="font-semibold">{t("contact.box.whatsapp.t")}</p>
                    <p className="text-sm">{COMPANY.phone}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("contact.box.whatsapp.s")}</p>
                  </div>
                </CardContent>
              </Card>
            </a>
            <Card className="border-border overflow-hidden">
              <iframe
                title="Auvelais"
                src="https://www.openstreetmap.org/export/embed.html?bbox=4.628%2C50.439%2C4.658%2C50.453&amp;layer=mapnik&amp;marker=50.4463%2C4.6429"
                className="w-full h-56 border-0"
              />
            </Card>
          </div>

          <Card className="lg:col-span-2 border-border">
            <CardContent className="p-7 sm:p-9">
              {success ? (
                <div data-testid="contact-success" className="text-center py-10">
                  <div className="h-14 w-14 rounded-full bg-[#00C389]/15 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-7 w-7 text-[#00C389]" />
                  </div>
                  <h3 className="text-2xl font-bold">{t("contact.success.title")}</h3>
                  <p className="mt-2 text-muted-foreground">{t("contact.success.sub")}</p>
                  <Button onClick={() => setSuccess(false)} variant="outline" className="mt-6">{t("contact.sendAnother")}</Button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">{t("contact.fullName")} *</label>
                      <input data-testid="contact-name" required value={form.name} onChange={(e) => onChange("name", e.target.value)} className="w-full h-11 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#0057B8]" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">{t("contact.email")} *</label>
                      <input data-testid="contact-email" type="email" required value={form.email} onChange={(e) => onChange("email", e.target.value)} className="w-full h-11 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#0057B8]" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">{t("contact.company")}</label>
                      <input data-testid="contact-company" value={form.company} onChange={(e) => onChange("company", e.target.value)} className="w-full h-11 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#0057B8]" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">{t("contact.phone")}</label>
                      <input data-testid="contact-phone" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} className="w-full h-11 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#0057B8]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">{t("contact.service")}</label>
                    <Select value={form.service} onValueChange={(v) => onChange("service", v)}>
                      <SelectTrigger data-testid="contact-service" className="h-11"><SelectValue placeholder={t("contact.servicePh")} /></SelectTrigger>
                      <SelectContent>
                        {SERVICE_CATEGORIES.map((s) => <SelectItem key={s.id} value={t(s.titleKey)}>{t(s.titleKey)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">{t("contact.message")} *</label>
                    <textarea data-testid="contact-message" required rows={5} value={form.message} onChange={(e) => onChange("message", e.target.value)} className="w-full px-3 py-2.5 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#0057B8] resize-y" />
                  </div>
                  <Button data-testid="contact-submit" type="submit" disabled={loading} className="bg-[#0057B8] hover:bg-[#004a9c] text-white h-11 px-6">
                    {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {t("contact.sending")}</> : <>{t("contact.submit")} <Send className="ml-2 h-4 w-4" /></>}
                  </Button>
                  <p className="text-xs text-muted-foreground">{t("contact.gdpr")}</p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
