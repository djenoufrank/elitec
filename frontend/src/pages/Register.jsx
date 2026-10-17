import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function Register() {
  const { t } = useT();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", company: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const u = await register(form);
      toast.success(t("portal.welcome") + ", " + u.name);
      navigate("/portal", { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 elitec-hero-grid">
      <Card className="w-full max-w-md border-border">
        <CardContent className="p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#0057B8] text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold">Elitec</span>
          </div>
          <h1 data-testid="register-title" className="text-2xl font-bold tracking-tight">{t("auth.register.title")}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("auth.register.sub")}</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("auth.name")} *</label>
              <input data-testid="register-name" required value={form.name} onChange={(e) => onChange("name", e.target.value)}
                className="w-full h-11 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#0057B8]" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("auth.email")} *</label>
              <input data-testid="register-email" type="email" required value={form.email} onChange={(e) => onChange("email", e.target.value)}
                className="w-full h-11 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#0057B8]" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("auth.company")}</label>
              <input data-testid="register-company" value={form.company} onChange={(e) => onChange("company", e.target.value)}
                className="w-full h-11 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#0057B8]" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("auth.password")} *</label>
              <input data-testid="register-password" type="password" required minLength={8} value={form.password} onChange={(e) => onChange("password", e.target.value)}
                className="w-full h-11 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#0057B8]" />
            </div>
            <Button data-testid="register-submit" type="submit" disabled={loading} className="w-full bg-[#0057B8] hover:bg-[#004a9c] text-white h-11">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserPlus className="h-4 w-4 mr-2" /> {t("auth.signup")}</>}
            </Button>
          </form>
          <p className="mt-6 text-sm text-muted-foreground text-center">
            {t("auth.haveAccount")}{" "}
            <Link to="/login" className="text-[#0057B8] font-medium hover:underline">{t("auth.signin")}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
