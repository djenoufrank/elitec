import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { COMPANY } from "@/lib/data";
import { FEATURES } from "@/lib/features";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useT();
  const { user, logout } = useAuth();

  const NAV = [
    { to: "/services", label: t("nav.services") },
    { to: "/offers", label: t("nav.offers") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/calculator", label: t("nav.calculator") },
    { to: "/about", label: t("nav.about") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const onLogout = () => { logout(); navigate("/"); };

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-40 transition-all ${
        scrolled ? "backdrop-blur-xl bg-background/80 border-b border-border" : "bg-background/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <Link to="/" data-testid="nav-logo" className="flex items-center gap-2">
            <img src={COMPANY.logo} alt="Elitec" className={`h-14 sm:h-16 w-auto ${dark ? "brightness-0 invert" : ""}`} />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                data-testid={`nav-link-${n.to.slice(1)}`}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "text-[#0057B8] bg-[#0057B8]/10" : "text-foreground/80 hover:text-[#0057B8] hover:bg-muted"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <button
              data-testid="theme-toggle"
              onClick={toggleDark}
              aria-label="Toggle theme"
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-muted transition"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {FEATURES.authentication && user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to={user.role === "admin" ? "/admin" : "/portal"}>
                  <Button data-testid="header-portal-btn" variant="outline" className="border-[#0057B8] text-[#0057B8] hover:bg-[#0057B8]/5">
                    <LayoutDashboard className="h-4 w-4 mr-1.5" />
                    {user.role === "admin" ? t("nav.admin") : t("nav.portal")}
                  </Button>
                </Link>
                <Button data-testid="header-logout-btn" onClick={onLogout} variant="ghost" size="icon" aria-label={t("nav.logout")}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                {FEATURES.authentication && <Link to="/login">
                  <Button data-testid="header-login-btn" variant="ghost" size="sm" className="text-foreground/80">
                    {t("nav.login")}
                  </Button>
                </Link>}
                <Link to="/contact">
                  <Button data-testid="header-contact-btn" className="bg-[#0057B8] hover:bg-[#004a9c] text-white">
                    {t("nav.contact")}
                  </Button>
                </Link>
              </div>
            )}
            <button
              data-testid="mobile-menu-toggle"
              onClick={() => setOpen(!open)}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted"
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-4 border-t border-border pt-3" data-testid="mobile-menu">
            <div className="flex flex-col gap-1">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">
                  {n.label}
                </Link>
              ))}
              <div className="flex items-center justify-between mt-3 px-3">
                <LanguageSwitcher />
                <button onClick={toggleDark} className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border">
                  {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
              {FEATURES.authentication && user ? (
                <>
                  <Link to={user.role === "admin" ? "/admin" : "/portal"} className="mt-2">
                    <Button className="w-full bg-[#0057B8] hover:bg-[#004a9c] text-white">
                      {user.role === "admin" ? t("nav.admin") : t("nav.portal")}
                    </Button>
                  </Link>
                  <Button onClick={onLogout} variant="outline" className="w-full mt-2">{t("nav.logout")}</Button>
                </>
              ) : (
                <>
                  {FEATURES.authentication && <Link to="/login" className="mt-2">
                    <Button variant="outline" className="w-full">{t("nav.login")}</Button>
                  </Link>}
                  <Link to="/contact" className="mt-2">
                    <Button className="w-full bg-[#0057B8] hover:bg-[#004a9c] text-white">{t("nav.contact")}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
