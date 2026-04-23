import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/Button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/medicpedia", label: "Medicpedia" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "Tentang" },
];

const PublicLayout = () => {
  const { app_name, logo } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to) => to !== "#" && location.pathname === to;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-xl focus:font-bold focus: transition-all"
      >
        Lanjut ke konten utama
      </a>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar Drawer ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col md:hidden
          bg-zinc-50 dark:bg-slate-900 border-r border-zinc-200 dark:border-white/5
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-white/5 flex-shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setMobileOpen(false)}
          >
            {logo && (
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center p-1.5 border border-primary/20">
                <img
                  src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              {app_name}
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-3 mb-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
            Navigasi
          </p>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200
                ${isActive(link.to)
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 dark:text-slate-400 hover:bg-zinc-200 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white"
                }`}
            >
              {isActive(link.to) && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              )}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer — CTA */}
        <div className="flex-shrink-0 p-6 border-t border-zinc-200 dark:border-white/5 space-y-3">
          {/* Theme toggle mobile */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:border-primary/40 hover:text-primary transition-all active:scale-95"
          >
            {theme === "light" ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Mode Gelap
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l-.707-.707M6.343 6.343l-.707-.707" />
                </svg>
                Mode Terang
              </>
            )}
          </button>
          
          {localStorage.getItem("token") ? (
            <Link
              to="/consultations/ai"
              onClick={() => setMobileOpen(false)}
            >
              <Button className="w-full bg-primary text-white hover:bg-primary-600 py-3 text-xs font-bold uppercase tracking-widest rounded-2xl transition-all hover:scale-[1.02] active:scale-95">
                Konsultasi AI
              </Button>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full py-3 rounded-2xl border-2 border-zinc-300 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-primary/40 hover:text-primary transition-all active:scale-95"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
              >
                <Button className="w-full bg-primary text-white hover:bg-primary-600 py-3 text-xs font-bold uppercase tracking-widest rounded-2xl transition-all hover:scale-[1.02] active:scale-95">
                  Daftar Sekarang
                </Button>
              </Link>
            </>
          )}
        </div>
      </aside>

      {/* ── Header / Navigation ── */}
      <header className="sticky top-0 z-30 bg-zinc-100/90 dark:bg-slate-950/90 border-b border-zinc-200 dark:border-white/5">
        <nav className="container mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {logo && (
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center p-1.5 border border-primary/20 transition-all group-hover:scale-110 group-hover:border-primary/40  ">
                <img
                  src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              {app_name}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`text-sm font-semibold transition-colors tracking-wide
                  ${isActive(link.to)
                    ? "text-primary"
                    : "text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-zinc-200 dark:bg-slate-800 border border-zinc-300 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:border-primary/40 transition-all active:scale-95 group"
              title={`Beralih ke mode ${theme === "light" ? "gelap" : "terang"}`}
            >
              {theme === "light" ? (
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l-.707-.707M6.343 6.343l-.707-.707" />
                </svg>
              )}
            </button>

            {localStorage.getItem("token") ? (
              <Link to="/consultations/ai">
                <Button className="bg-primary text-white hover:bg-primary-600 px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95">
                  Konsultasi AI
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-500 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors tracking-widest uppercase"
                >
                  Masuk
                </Link>
                <Link to="/register">
                  <Button className="bg-primary text-white hover:bg-primary-600 px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95">
                    Daftar Sekarang
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2.5 rounded-xl bg-zinc-200 dark:bg-white/5 border border-zinc-300 dark:border-outline-variant/20 text-slate-600 dark:text-slate-400 hover:text-primary transition-all active:scale-95"
            aria-label="Buka menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </nav>
      </header>

      {/* ── Main Content ── */}
      <main id="main-content" className="flex-grow">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-zinc-200 dark:bg-slate-900 border-t border-zinc-300 dark:border-white/5 pt-24 pb-12 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6">
                {logo && (
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center p-1 opacity-50 grayscale hover:grayscale-0 transition-all hover:opacity-100">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {app_name}
                </span>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-medium text-sm">
                Cerdas Menjaga Kesehatan. Solusi kesehatan digital terintegrasi
                untuk masa depan yang lebih baik.
              </p>
            </div>
            <div>
              <h4 className="text-slate-500 dark:text-slate-300 font-bold uppercase tracking-widest text-[10px] mb-6 px-3 border-l-2 border-primary">
                Layanan
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/medicpedia" className="text-slate-500 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors font-medium text-sm">
                    Medicpedia
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-slate-500 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors font-medium text-sm">
                    Cek Gejala AI
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-500 dark:text-slate-300 font-bold uppercase tracking-widest text-[10px] mb-6 px-3 border-l-2 border-primary">
                Perusahaan
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link to="#" className="text-slate-500 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors font-medium text-sm">Tentang Kami</Link>
                </li>
                <li>
                  <Link to="#" className="text-slate-500 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors font-medium text-sm">Kontak</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-slate-500 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors font-medium text-sm">Syarat & Ketentuan</Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-slate-500 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors font-medium text-sm">Kebijakan Privasi</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-300 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] text-center">
              &copy; {new Date().getFullYear()} {app_name}. Seluruh Hak Cipta Dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
