import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const { t } = useT();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/portal";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success(t("portal.welcome") + ", " + u.name);
      navigate(u.role === "admin" ? "/admin" : (from === "/portal" || from === "/login" ? "/portal" : from), { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 data-testid="login-title" className="text-2xl font-bold tracking-tight">{t("auth.login.title")}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("auth.login.sub")}</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("auth.email")}</label>
              <input
                data-testid="login-email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("auth.password")}</label>
              <input
                data-testid="login-password" type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
              />
            </div>
            <Button data-testid="login-submit" type="submit" disabled={loading} className="w-full bg-[#0057B8] hover:bg-[#004a9c] text-white h-11">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><LogIn className="h-4 w-4 mr-2" /> {t("auth.signin")}</>}
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground text-center bg-muted/40 rounded-md p-2.5">
            {t("auth.demoHint")}
          </p>

          <p className="mt-6 text-sm text-muted-foreground text-center">
            {t("auth.noAccount")}{" "}
            <Link to="/register" className="text-[#0057B8] font-medium hover:underline">{t("auth.signup")}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
