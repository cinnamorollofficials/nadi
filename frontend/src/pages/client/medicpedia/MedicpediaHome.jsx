import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import Button from "../../../components/Button";

const MedicpediaHome = () => {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-secondary-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
            Solusi <span className="text-primary-300">Kesehatan</span> <br />
            Dalam Genggaman.
          </h1>
          <p className="text-primary-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90 leading-relaxed font-medium">
            Temukan informasi lengkap mengenai kesehatan, penyakit, dan nutrisi
            untuk mendukung gaya hidup sehat Anda.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-20 -mt-20">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Penyakit A-Z Card */}
          <Link to="/medicpedia/penyakit" className="group">
            <Card className="p-8 h-full border-none shadow-2xl shadow-primary/5 group-hover:shadow-primary/20 transition-all duration-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full flex items-center justify-center translate-x-10 -translate-y-10 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500">
                <svg
                  className="w-12 h-12 text-red-500/20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.596 15.12a2 2 0 00-1.022.547l-1.028 1.028A2 2 0 004.5 20h15a2 2 0 001.454-3.546l-1.526-1.026z"
                  />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-red-100/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300 transform-gpu">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-surface-on mb-4 group-hover:text-red-600 transition-colors">
                  Penyakit A-Z
                </h2>
                <p className="text-surface-on-variant leading-relaxed text-lg mb-8 font-medium">
                  Cari tahu tentang berbagai penyakit, gejala, penyebab,
                  diagnosis, dan cara pencegahannya.
                </p>
                <Button
                  variant="tonal"
                  className="w-full justify-between items-center bg-red-50 hover:bg-red-100 text-red-700 font-bold border-none shadow-sm shadow-red-200"
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
            <Card className="p-8 h-full border-none shadow-2xl shadow-secondary/5 group-hover:shadow-secondary/20 transition-all duration-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full flex items-center justify-center translate-x-10 -translate-y-10 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500">
                <svg
                  className="w-12 h-12 text-green-500/20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 01-1.5-.454M9 16v2m3-6v6m3-8v8m-7 0a1 1 0 001 1h4a1 1 0 001-1m-5-1v-1h4v1m-4-1a1 1 0 011-1h4a1 1 0 011 1v1M9 6.75V4.5a1 1 0 011-1h4a1 1 0 011 1v2.25M9 6.75h6"
                  />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-green-100/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300 transform-gpu">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 3v1m0 16v1m9-9h1M3 12h1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-surface-on mb-4 group-hover:text-green-600 transition-colors">
                  Nutrisi A-Z
                </h2>
                <p className="text-surface-on-variant leading-relaxed text-lg mb-8 font-medium">
                  Eksplorasi gizi, vitamin, mineral, dan asupan nutrisi yang
                  dibutuhkan tubuh untuk tetap bugar.
                </p>
                <Button
                  variant="tonal"
                  className="w-full justify-between items-center bg-green-50 hover:bg-green-100 text-green-700 font-bold border-none shadow-sm shadow-green-200"
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
