import { useT } from "@/lib/i18n";

export default function LanguageSwitcher({ className = "" }) {
  const { lang, setLang } = useT();
  return (
    <div data-testid="lang-switcher" className={`inline-flex items-center rounded-md border border-border overflow-hidden ${className}`}>
      {["fr", "en"].map((l) => (
        <button
          key={l}
          data-testid={`lang-${l}`}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 text-xs font-semibold uppercase transition ${
            lang === l ? "bg-[#0057B8] text-white" : "bg-background text-foreground/70 hover:bg-muted"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
