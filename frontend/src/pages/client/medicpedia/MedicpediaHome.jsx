import { useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import Button from "../../../components/Button";

const MedicpediaHome = () => {
  useEffect(() => {
    document.title = "Medicpedia — Ensiklopedia Kesehatan Digital Nadi";
    return () => { document.title = "Nadi"; };
  }, []);
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden min-h-[50vh] flex items-center"
        style={{ 
          backgroundImage: "url('/assets/medicpedia-bg-friendly.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Very subtle overlay so the image is fully visible */}
        <div className="absolute inset-0 bg-white/30 dark:bg-slate-950/70" />
        
        <div className="absolute inset-0 opacity-30 dark:opacity-20 mix-blend-overlay">
          <div className="absolute top-10 left-10 w-72 h-72 bg-teal-400/10 rounded-full" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-primary/10 rounded-full" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center w-full">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none text-slate-900 dark:text-white">
            Solusi <span className="text-teal-600 dark:text-teal-400">Kesehatan</span> <br />
            Dalam Genggaman.
          </h1>
          <p className="text-slate-600 dark:text-teal-100/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Temukan informasi lengkap mengenai kesehatan, penyakit, dan nutrisi
            untuk mendukung gaya hidup sehat Anda.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Penyakit A-Z Card */}
          <Link to="/medicpedia/penyakit" className="group">
            <Card className="p-8 h-full border border-slate-200 dark:border-white/10 shadow-none transition-all duration-500 overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-surface-on mb-4 group-hover:text-red-600 transition-colors">
                  Penyakit A-Z
                </h2>
                <p className="text-surface-on-variant leading-relaxed text-lg mb-8 font-medium">
                  Cari tahu tentang berbagai penyakit, gejala, penyebab,
                  diagnosis, dan cara pencegahannya.
                </p>
                <Button
                  variant="tonal"
                  className="w-full flex py-6 justify-between items-center bg-red-50 hover:bg-red-100 text-red-700 font-bold border-none"
                >
                  Lihat Semua Penyakit
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Button>
              </div>
            </Card>
          </Link>

          {/* Nutrisi A-Z Card */}
          <Link to="/medicpedia/nutrisi" className="group">
            <Card className="p-8 h-full border border-slate-200 dark:border-white/10 shadow-none transition-all duration-500 overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-surface-on mb-4 group-hover:text-green-600 transition-colors">
                  Nutrisi A-Z
                </h2>
                <p className="text-surface-on-variant leading-relaxed text-lg mb-8 font-medium">
                  Eksplorasi gizi, vitamin, mineral, dan asupan nutrisi yang
                  dibutuhkan tubuh untuk tetap bugar.
                </p>
                <Button
                  variant="tonal"
                  className="w-full flex py-6 justify-between items-center bg-green-50 hover:bg-green-100 text-green-700 font-bold border-none"
                >
                  Lihat Semua Nutrisi
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Button>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Why Us section */}
      <section className="bg-surface-variant/10 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-black text-surface-on tracking-tight">
              Kenapa Harus Medicpedia?
            </h3>
            <p className="text-surface-on-variant mt-2 font-medium">
              Kami menyediakan informasi kesehatan yang divalidasi dan mudah
              dimengerti.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="text-primary font-black text-4xl mb-3">01</div>
              <h4 className="font-bold text-surface-on mb-2 text-xl">
                Lengkap & Akurat
              </h4>
              <p className="text-surface-on-variant text-sm font-medium opacity-80">
                Informasi yang disusun dari berbagai sumber medis terpercaya.
              </p>
            </div>
            <div className="text-center">
              <div className="text-secondary font-black text-4xl mb-3">02</div>
              <h4 className="font-bold text-surface-on mb-2 text-xl">
                Mudah Dicari
              </h4>
              <p className="text-surface-on-variant text-sm font-medium opacity-80">
                Gunakan fitur alfabet untuk pencarian penyakit atau nutrisi
                dengan cepat.
              </p>
            </div>
            <div className="text-center">
              <div className="text-primary font-black text-4xl mb-3">03</div>
              <h4 className="font-bold text-surface-on mb-2 text-xl">
                Update Berkala
              </h4>
              <p className="text-surface-on-variant text-sm font-medium opacity-80">
                Konten yang selalu diperbarui mengikuti perkembangan dunia
                medis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicpediaHome;
