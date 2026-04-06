import { Link, Outlet } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import Button from "../components/Button";

const PublicLayout = () => {
  const { app_name, logo } = useSettings();

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-white font-sans">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-white/5">
        <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            {logo && (
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center p-1.5 border border-white/10 transition-all group-hover:scale-110 group-hover:border-accent-red/30">
                <img
                  src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
            <span className="text-2xl font-black tracking-tighter text-white group-hover:text-accent-red transition-colors uppercase italic">
              {app_name}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link
              to="/"
              className="text-sm font-bold text-white/60 hover:text-white transition-colors tracking-wide uppercase"
            >
              Home
            </Link>
            <Link
              to="/medicpedia"
              className="text-sm font-bold text-white/60 hover:text-white transition-colors tracking-wide uppercase"
            >
              Medicpedia
            </Link>
            <Link
              to="#"
              className="text-sm font-bold text-white/60 hover:text-white transition-colors tracking-wide uppercase"
            >
              Produk
            </Link>
            <Link
              to="#"
              className="text-sm font-bold text-white/60 hover:text-white transition-colors tracking-wide uppercase"
            >
              Tentang
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden sm:block text-sm font-bold text-white/80 hover:text-white transition-colors uppercase tracking-widest"
            >
              Masuk
            </Link>
            <Link to="/register">
              <Button className="bg-white text-black hover:bg-white/90 px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-full shadow-xl shadow-white/5 transition-all hover:scale-105 active:scale-95">
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
      <footer className="bg-navy-950 border-t border-white/5 pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6">
                {logo && (
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center p-1 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <span className="text-xl font-black text-white italic uppercase">
                  {app_name}
                </span>
              </Link>
              <p className="text-white/40 max-w-sm leading-relaxed font-medium">
                Cerdas Menjaga Kesehatan. Solusi kesehatan digital terintegrasi
                untuk masa depan yang lebih baik.
              </p>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">
                Layanan
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/medicpedia"
                    className="text-white/40 hover:text-white transition-colors font-medium"
                  >
                    Medicpedia
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white/40 hover:text-white transition-colors font-medium"
                  >
                    Cek Gejala AI
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white/40 hover:text-white transition-colors font-medium"
                  >
                    Tanya Dokter
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white/40 hover:text-white transition-colors font-medium"
                  >
                    Beli Obat
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">
                Perusahaan
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="#"
                    className="text-white/40 hover:text-white transition-colors font-medium"
                  >
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white/40 hover:text-white transition-colors font-medium"
                  >
                    Kontak
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-white/40 hover:text-white transition-colors font-medium"
                  >
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-white/40 hover:text-white transition-colors font-medium"
                  >
                    Kebijakan Privasi
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-white/20 uppercase tracking-widest text-center">
              &copy; {new Date().getFullYear()} {app_name}. Seluruh Hak Cipta
              Dilindungi.
            </p>
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 transition-all cursor-pointer">
                IG
              </div>
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 transition-all cursor-pointer">
                TW
              </div>
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 transition-all cursor-pointer">
                FB
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
