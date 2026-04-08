import { Link, Outlet } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/Button";

const PublicLayout = () => {
  const { app_name, logo } = useSettings();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-navy-950 text-slate-900 dark:text-white font-sans transition-colors duration-300">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-slate-100/80 dark:bg-navy-950/80 backdrop-blur-xl dark:border-outline-variant/20">
        <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            {logo && (
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center p-1.5 border border-primary/20 transition-all group-hover:scale-110 group-hover:border-primary/40 shadow-lg shadow-primary/5">
                <img
                  src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`}
                  alt="Logo"
                  onClick={() => navigate("/")}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              {app_name}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link
              to="/"
              className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors tracking-wide"
            >
              Home
            </Link>
            <Link
              to="/medicpedia"
              className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors tracking-wide"
            >
              Medicpedia
            </Link>

            <Link
              to="/faq"
              className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors tracking-wide"
            >
              FAQ
            </Link>
            <Link
              to="#"
              className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors tracking-wide"
            >
              Tentang
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-outline-variant/20 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all active:scale-95 group"
              title={`Beralih ke mode ${theme === "light" ? "gelap" : "terang"}`}
            >
              {theme === "light" ? (
                <svg
                  className="w-5 h-5 group-hover:rotate-12 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l-.707-.707M6.343 6.343l-.707-.707"
                  />
                </svg>
              )}
            </button>

            <Link
              to="/login"
              className="hidden sm:block text-sm font-bold text-slate-500 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors tracking-widest uppercase"
            >
              Masuk
            </Link>
            <Link to="/register">
              <Button className="bg-primary text-white hover:bg-primary-600 px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer Area */}
      <footer className="bg-white dark:bg-navy-950 border-t border-slate-200 dark:border-outline-variant/20 pt-24 pb-12 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6">
                {logo && (
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center p-1 opacity-50 grayscale hover:grayscale-0 transition-all hover:opacity-100">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`}
                      alt="Logo"
                      onClick={() => navigate("/")}
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
                  <Link
                    to="/medicpedia"
                    className="text-slate-500 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors font-medium text-sm"
                  >
                    Medicpedia
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-slate-500 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors font-medium text-sm"
                  >
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
                  <Link
                    to="#"
                    className="text-slate-500 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors font-medium text-sm"
                  >
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-slate-500 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors font-medium text-sm"
                  >
                    Kontak
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-slate-500 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors font-medium text-sm"
                  >
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-slate-500 dark:text-white/40 hover:text-primary dark:hover:text-white transition-colors font-medium text-sm"
                  >
                    Kebijakan Privasi
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 dark:border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] text-center">
              &copy; {new Date().getFullYear()} {app_name}. Seluruh Hak Cipta
              Dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
