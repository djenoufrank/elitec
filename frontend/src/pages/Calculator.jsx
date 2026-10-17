import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Calculator as CalcIcon, Save, Send, Download, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { customerService } from "@/services/CustomerService";
import { useT } from "@/lib/i18n";

// Pricing benchmarked against 2026 Belgian/EU MSP market rates
const SUPPORT_LEVELS = { Basic: 25, Standard: 48, Premium: 80, Enterprise: 125 };
const CLOUD_PRICES = { "Microsoft 365": 19, "Microsoft Azure": 40, "Backup": 14, "Disaster Recovery": 28 };
const SECURITY_PRICES = { "Entra ID + MFA": 9, "Conditional Access": 7, "Endpoint Protection": 9, "Identity Lifecycle": 11 };
const COVERAGE_MULT = { business: 1, extended: 1.25, "24/7": 1.6 };
const SERVER_PRICE = 110;
const WORKSTATION_PRICE = 15;
const NETWORK_PRICE = 38;
const COLORS = ["#0057B8", "#00A3E0", "#00C389", "#F59E0B", "#8B5CF6"];

function fmt(n) {
  return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default function Calculator() {
  const { t } = useT();
  const [users, setUsers] = useState(50);
  const [supportLevel, setSupportLevel] = useState("Standard");
  const [cloud, setCloud] = useState({ "Microsoft 365": true, "Microsoft Azure": false, "Backup": true, "Disaster Recovery": false });
  const [security, setSecurity] = useState({ "Entra ID + MFA": true, "Conditional Access": true, "Endpoint Protection": true, "Identity Lifecycle": false });
  const [servers, setServers] = useState(4);
  const [workstations, setWorkstations] = useState(50);
  const [networkDevices, setNetworkDevices] = useState(8);
  const [coverage, setCoverage] = useState("business");
  const [saving, setSaving] = useState(false);

  const supportLabels = {
    Basic: t("calc.support.basic"), Standard: t("calc.support.standard"),
    Premium: t("calc.support.premium"), Enterprise: t("calc.support.enterprise"),
  };
  const coverageLabels = {
    business: t("calc.coverage.business"),
    extended: t("calc.coverage.extended"),
    "24/7": t("calc.coverage.247"),
  };
  const pkgLabels = {
    Starter: t("calc.pkg.starter"), Growth: t("calc.pkg.growth"),
    Business: t("calc.pkg.business"), Enterprise: t("calc.pkg.enterprise"),
  };

  const breakdown = useMemo(() => {
    const mult = COVERAGE_MULT[coverage] || 1;
    const userCost = users * SUPPORT_LEVELS[supportLevel] * mult;
    const cloudCost = Object.entries(cloud).filter(([,v]) => v).reduce((sum, [k]) => sum + CLOUD_PRICES[k] * users, 0);
    const securityCost = Object.entries(security).filter(([,v]) => v).reduce((sum, [k]) => sum + SECURITY_PRICES[k] * users, 0);
    const infraCost = servers * SERVER_PRICE + workstations * WORKSTATION_PRICE + networkDevices * NETWORK_PRICE;
    return {
      [t("svc.managed.title")]: Math.round(userCost),
      [t("calc.cloud")]: Math.round(cloudCost),
      [t("calc.security")]: Math.round(securityCost),
      [t("calc.infra")]: Math.round(infraCost),
    };
  }, [users, supportLevel, cloud, security, servers, workstations, networkDevices, coverage, t]);

  const monthly = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const annual = monthly * 12;
  const pkg = monthly < 2500 ? pkgLabels.Starter : monthly < 8000 ? pkgLabels.Growth : monthly < 20000 ? pkgLabels.Business : pkgLabels.Enterprise;

  const chartData = Object.entries(breakdown).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
  const toggle = (setter) => (k) => setter((s) => ({ ...s, [k]: !s[k] }));
  const toggleCloud = toggle(setCloud);
  const toggleSecurity = toggle(setSecurity);

  const saveEstimate = async () => {
    setSaving(true);
    try {
      await customerService.saveQuote({
        users, support_level: supportLevel,
        cloud_services: Object.keys(cloud).filter((k) => cloud[k]),
        security_services: Object.keys(security).filter((k) => security[k]),
        servers, workstations, network_devices: networkDevices,
        support_coverage: coverageLabels[coverage],
        monthly_total: monthly, annual_total: annual, breakdown,
      });
      toast.success(t("calc.saved"));
    } catch { toast.error(t("calc.saveErr")); }
    finally { setSaving(false); }
  };

  const downloadEstimate = () => {
    const lines = [
      "ELITEC — ESTIMATION IT",
      "==============================",
      `${t("calc.users")}: ${users}`,
      `${t("calc.supportLevel")}: ${supportLabels[supportLevel]}`,
      `${t("calc.coverage")}: ${coverageLabels[coverage]}`,
      `${t("calc.cloud")}: ${Object.keys(cloud).filter(k => cloud[k]).join(", ") || "—"}`,
      `${t("calc.security")}: ${Object.keys(security).filter(k => security[k]).join(", ") || "—"}`,
      `${t("calc.servers")}: ${servers}, ${t("calc.workstations")}: ${workstations}, ${t("calc.network")}: ${networkDevices}`,
      "",
      ...Object.entries(breakdown).map(([k, v]) => `  ${k}: ${fmt(v)} ${t("calc.month")}`),
      "",
      `${t("calc.yourEstimate")}: ${fmt(monthly)} ${t("calc.month")}`,
      `${fmt(annual)} ${t("calc.annually")}`,
      `${t("calc.recommended")}: ${pkg}`,
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "elitec-estimate.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <section className="py-16 elitec-hero-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-[#0057B8] text-white flex items-center justify-center"><CalcIcon className="h-5 w-5" /></div>
            <p className="text-sm uppercase tracking-wider text-[#0057B8] font-semibold">{t("calc.kicker")}</p>
          </div>
          <h1 data-testid="calc-headline" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
            {t("calc.headline")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{t("calc.sub")}</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Card data-testid="calc-users-card" className="border-border">
              <CardContent className="p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="font-semibold">{t("calc.users")}</h3>
                  <span className="text-2xl font-bold text-[#0057B8]" data-testid="calc-users-value">{users}</span>
                </div>
                <Slider data-testid="calc-users-slider" value={[users]} onValueChange={(v) => setUsers(v[0])} min={1} max={1000} step={1} />
                <div className="flex justify-between text-xs text-muted-foreground mt-2"><span>1</span><span>1000</span></div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 grid sm:grid-cols-2 gap-5">
                <div>
                  <h3 className="font-semibold mb-2">{t("calc.supportLevel")}</h3>
                  <Select value={supportLevel} onValueChange={setSupportLevel}>
                    <SelectTrigger data-testid="calc-support-level" className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(SUPPORT_LEVELS).map((s) => <SelectItem key={s} value={s}>{supportLabels[s]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t("calc.coverage")}</h3>
                  <RadioGroup data-testid="calc-coverage" value={coverage} onValueChange={setCoverage} className="space-y-2">
                    {Object.keys(COVERAGE_MULT).map((c) => (
                      <div key={c} className="flex items-center gap-2">
                        <RadioGroupItem value={c} id={`cov-${c}`} />
                        <Label htmlFor={`cov-${c}`} className="cursor-pointer text-sm">{coverageLabels[c]}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{t("calc.cloud")} <span className="text-xs text-muted-foreground font-normal">{t("calc.cloud.unit")}</span></h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.keys(CLOUD_PRICES).map((k) => (
                    <label key={k} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${cloud[k] ? "border-[#0057B8] bg-[#0057B8]/5" : "border-border hover:border-[#0057B8]/40"}`}>
                      <div className="flex items-center gap-3">
                        <Checkbox data-testid={`calc-cloud-${k}`} checked={cloud[k]} onCheckedChange={() => toggleCloud(k)} />
                        <span className="text-sm font-medium">{k}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">€{CLOUD_PRICES[k]}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{t("calc.security")} <span className="text-xs text-muted-foreground font-normal">{t("calc.cloud.unit")}</span></h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.keys(SECURITY_PRICES).map((k) => (
                    <label key={k} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${security[k] ? "border-[#00C389] bg-[#00C389]/5" : "border-border hover:border-[#00C389]/40"}`}>
                      <div className="flex items-center gap-3">
                        <Checkbox data-testid={`calc-security-${k}`} checked={security[k]} onCheckedChange={() => toggleSecurity(k)} />
                        <span className="text-sm font-medium">{k}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">€{SECURITY_PRICES[k]}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{t("calc.infra")}</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: t("calc.servers"), value: servers, set: setServers, key: "servers" },
                    { label: t("calc.workstations"), value: workstations, set: setWorkstations, key: "workstations" },
                    { label: t("calc.network"), value: networkDevices, set: setNetworkDevices, key: "network" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{f.label}</label>
                      <input
                        data-testid={`calc-${f.key}`} type="number" min={0}
                        value={f.value}
                        onChange={(e) => f.set(Math.max(0, parseInt(e.target.value || "0", 10)))}
                        className="mt-1 w-full h-11 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              <Card data-testid="calc-summary" className="border-border overflow-hidden">
                <div className="bg-gradient-to-br from-[#0057B8] to-[#00A3E0] text-white p-6">
                  <p className="text-sm uppercase tracking-wider opacity-80">{t("calc.yourEstimate")}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span data-testid="calc-monthly" className="text-4xl font-bold">{fmt(monthly)}</span>
                    <span className="text-sm opacity-80">{t("calc.month")}</span>
                  </div>
                  <p data-testid="calc-annual" className="text-sm opacity-90 mt-1">{fmt(annual)} {t("calc.annually")}</p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {t("calc.recommended")}: {pkg}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                          {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v) => fmt(v)} />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="space-y-2 mt-2">
                    {Object.entries(breakdown).map(([k, v], i) => (
                      <li key={k} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                          {k}
                        </span>
                        <span className="font-semibold">{fmt(v)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-2">
                <Button data-testid="calc-save" onClick={saveEstimate} disabled={saving} variant="outline" className="border-[#0057B8] text-[#0057B8]">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
                  {saving ? t("calc.saving") : t("calc.save")}
                </Button>
                <Button data-testid="calc-download" onClick={downloadEstimate} variant="outline" className="border-[#0057B8] text-[#0057B8]">
                  <Download className="h-4 w-4 mr-1.5" /> {t("calc.download")}
                </Button>
              </div>
              <Button data-testid="calc-request-quote" onClick={() => (window.location.href = "/contact")} className="w-full bg-[#0057B8] hover:bg-[#004a9c] text-white">
                <Send className="h-4 w-4 mr-1.5" /> {t("calc.emailQuote")}
              </Button>
              <p className="text-xs text-muted-foreground text-center">{t("calc.disclaimer")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
