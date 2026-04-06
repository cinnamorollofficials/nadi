import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { getPublicFaqs } from "../api/faq";

const Landing = () => {
  const [faqs, setFaqs] = useState([]);
  const [openFaqId, setOpenFaqId] = useState(null);

  useEffect(() => {
    getPublicFaqs({ limit: 10 })
      .then((res) => {
        if (res.data && res.data.data) {
          // Return only active / published FAQs
          setFaqs(res.data.data.filter((item) => item.status?.toLowerCase() === "published" || item.status?.toLowerCase() === "active"));
        }
      })
      .catch((err) => console.error("Failed to load FAQs:", err));
  }, []);

  return (
    <div className="bg-navy-950 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-20 left-10 w-96 h-96 bg-accent-red/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-3/5 text-left pt-10">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] mb-10 text-white/50">
                <span className="w-1.5 h-1.5 bg-accent-red rounded-full animate-pulse" />
                Revolusi Kesehatan Digital
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-[1] tracking-tighter mb-8 uppercase italic">
                Cerdas <br />
                Menjaga <span className="text-accent-red">Nadi</span> <br />
                Kehidupan.
              </h1>
              <p className="text-lg md:text-xl text-white/40 max-w-xl mb-12 font-medium leading-relaxed">
                Platform kesehatan terintegrasi yang menghubungkan Anda dengan
                layanan medis masa depan melalui teknologi AI dan data yang
                presisi.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <Link to="/register">
                  <Button className="bg-white text-black hover:bg-white/90 px-10 py-4 text-sm font-black uppercase tracking-widest rounded-none transform -skew-x-12 transition-all hover:scale-110 active:scale-95 shadow-2xl shadow-white/5">
                    Mulai Sekarang
                  </Button>
                </Link>
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-2 border-navy-950 bg-navy-800 overflow-hidden ring-2 ring-white/5"
                    >
                      <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-2 border-navy-950 bg-accent-red flex items-center justify-center text-[10px] font-black text-white ring-2 ring-white/5 uppercase">
                    10K+
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-2/5 w-full">
              <div className="glass-card rounded-5xl p-8 shadow-2xl shadow-black relative group">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent-red/20 blur-2xl group-hover:bg-accent-red/40 transition-all" />
                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter italic">
                  Cek Gejala Kamu
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Apa yang kamu rasakan hari ini?"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent-red/30 transition-all font-medium"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent-red rounded-xl flex items-center justify-center shadow-lg shadow-accent-red/20 hover:scale-105 active:scale-95 transition-all">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {["Pusing", "Demam", "Batuk", "Mual"].map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold text-white/30 border border-white/5 px-3 py-1.5 rounded-lg hover:text-white/60 hover:bg-white/5 cursor-pointer transition-all uppercase tracking-widest"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS LOGO */}
      <section className="py-20 border-y border-white/5">
        <div className="container mx-auto px-6 overflow-hidden">
          <p className="text-center text-[10px] font-black italic uppercase tracking-[0.4em] mb-12 text-white/20">
            Dipercaya Oleh Institusi Terkemuka
          </p>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {["Biocare", "Medix", "Vicare", "NeuroBeat", "Health+"].map(
              (name) => (
                <span
                  key={name}
                  className="text-2xl font-black italic uppercase text-white tracking-widest"
                >
                  {name}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ANALYSIS STEPS SECTION */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2">
              <h2 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-16">
                Prosedur Analisis <br />
                yang <span className="text-accent-red">Presisi</span> & Terukur.
              </h2>
              <div className="space-y-12">
                {[
                  {
                    id: "01",
                    title: "Input Gejala",
                    desc: "Sampaikan gejala yang Anda rasakan secara detail untuk analisis awal.",
                  },
                  {
                    id: "02",
                    title: "Analisis AI",
                    desc: "Teknologi AI kami memproses data Anda dengan ribuan database medis.",
                  },
                  {
                    id: "03",
                    title: "Hasil Terverifikasi",
                    desc: "Dapatkan diagnosis akurat dan rekomendasi langkah medis selanjutnya.",
                  },
                ].map((step) => (
                  <div key={step.id} className="flex gap-8 group">
                    <div className="text-4xl font-black text-accent-red/20 group-hover:text-accent-red transition-colors italic leading-none">
                      {step.id}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">
                        {step.title}
                      </h4>
                      <p className="text-white/40 font-medium leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white rounded-[3rem] p-12 text-black relative shadow-2xl shadow-black overflow-hidden group">
                <div className="absolute top-10 right-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <svg className="w-32 h-32" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="10 5"
                    />
                  </svg>
                </div>
                <h4 className="text-7xl font-black tracking-tighter uppercase italic mb-6">
                  98.4%
                </h4>
                <h5 className="text-2xl font-black uppercase tracking-tight mb-8">
                  Akurasi Data Medis
                </h5>
                <p className="text-black/60 font-bold mb-12 max-w-sm leading-relaxed">
                  Kami memanfaatkan machine learning tercanggih untuk memastikan
                  setiap diagnosis memiliki tingkat presisi tertinggi.
                </p>
                <div className="flex gap-12 pt-8 border-t border-black/5">
                  <div>
                    <div className="text-2xl font-black mb-1">12K+</div>
                    <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                      Data Terolah
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black mb-1">800+</div>
                    <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                      Dokter Ahli
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM SECTION */}
      <section className="py-32 bg-navy-900 border-y border-white/5">
        <div className="container mx-auto px-6 text-center max-w-4xl mx-auto mb-20 px-6">
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
            Ekosistem <span className="text-accent-red">Masa Depan.</span>
          </h2>
          <p className="text-white/40 font-medium text-lg leading-relaxed">
            Kami membangun fondasi kesehatan digital yang menghubungkan semua
            lini kebutuhan medis Anda dalam satu platform.
          </p>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-card rounded-4xl p-12 group hover:bg-white/5 transition-all h-[450px] flex flex-col justify-end">
              <div className="w-16 h-16 bg-accent-red/20 rounded-2xl flex items-center justify-center mb-8">
                <svg
                  className="w-8 h-8 text-accent-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h.01M16 12h.01M8 12h.01M12 16h.01M16 16h.01M8 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-6">
                AI Symptom <br />
                Checker
              </h3>
              <p className="text-white/40 font-medium leading-relaxed max-w-md mb-8">
                Asisten virtual yang belajar setiap detik untuk membantu Anda
                mendeteksi potensi penyakit melalui keluhan verbal maupun
                visual.
              </p>
              <Link
                to="#"
                className="text-accent-red font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all italic"
              >
                Pelajari Sistem
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
            <div className="space-y-6">
              <div className="glass-card rounded-4xl p-8 group hover:bg-white/5 transition-all">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-white/40 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
                  Nadi Poin
                </h4>
                <p className="text-white/40 text-xs font-bold leading-relaxed mb-6">
                  Dapatkan reward untuk setiap gaya hidup sehat yang Anda
                  jalani.
                </p>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-accent-red shadow-glow-red" />
                </div>
              </div>
              <div className="glass-card rounded-4xl p-8 group hover:bg-blue-600/10 transition-all border-blue-600/5">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
                  Beli Obat
                </h4>
                <p className="text-white/40 text-xs font-bold leading-relaxed">
                  Pengiriman obat resep kilat langsung ke pintu rumah Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY SECTION */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              {[
                { title: "Tersandikan", icon: "🔒" },
                { title: "Terdesentralisasi", icon: "🌐" },
                { title: "Privasi Penuh", icon: "👁️" },
                { title: "Audit Logging", icon: "📝" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="glass-card p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center group hover:bg-accent-red/5 transition-all cursor-default scale-100 hover:scale-105 active:scale-95 duration-500"
                >
                  <div className="text-4xl mb-6 transform group-hover:rotate-12 transition-transform">
                    {item.icon}
                  </div>
                  <div className="text-xs font-black uppercase text-white tracking-widest">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-10">
                Keamanan Data Anda <br />
                Adalah{" "}
                <span className="text-accent-red italic">
                  Prioritas Mutlak
                </span>{" "}
                Kami.
              </h2>
              <p className="text-white/40 font-medium text-lg leading-relaxed mb-12">
                Kami menerapkan standar keamanan perbankan internasional untuk
                memastikan setiap riwayat medis dan data pribadi Anda tersimpan
                dalam enkripsi berlapis.
              </p>
              <Button className="border-2 border-white/10 text-white font-black px-10 py-4 uppercase italic tracking-widest text-xs hover:bg-white hover:text-black transition-all">
                Pelajari Protokol Kami
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-32 border-t border-white/5 bg-navy-900/30">
        <div className="container mx-auto px-6 text-center mb-24 max-w-2xl mx-auto">
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
            Pertanyaan Umum
          </h2>
          <p className="text-white/20 font-bold uppercase tracking-widest text-[10px]">
            Semua yang perlu Anda ketahui tentang ekosistem kami
          </p>
        </div>

        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-4">
            {faqs.length > 0 ? (
              faqs.map((faq) => (
                <div
                  key={faq.id}
                  onClick={() =>
                    setOpenFaqId(openFaqId === faq.id ? null : faq.id)
                  }
                  className="bg-white/5 border border-white/5 rounded-2xl p-6 cursor-pointer group hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 font-black uppercase italic tracking-tight group-hover:text-white transition-colors">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-all text-white/20 transform ${openFaqId === faq.id ? "rotate-180 bg-accent-red text-white" : "group-hover:bg-accent-red group-hover:text-white"}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {openFaqId === faq.id && (
                    <div
                      className="mt-4 pt-4 border-t border-white/5 text-white/60 text-sm font-medium leading-relaxed prose prose-invert max-w-none break-words overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-white/40 italic py-10 font-medium">
                Belum ada pertanyaan umum.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="bg-accent-red rounded-[3rem] p-12 md:p-24 relative overflow-hidden group shadow-2xl shadow-accent-red/20 transform-gpu hover:scale-[1.01] transition-transform duration-700">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 50 Q 25 30 50 50 T 100 50"
                  stroke="white"
                  fill="none"
                  strokeWidth="0.5"
                />
                <path
                  d="M0 60 Q 25 40 50 60 T 100 60"
                  stroke="white"
                  fill="none"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
              <div className="lg:w-3/5">
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-8">
                  Dapatkan Wawasan <br />
                  Kesehatan Mingguan.
                </h2>
                <p className="text-white/70 font-bold text-lg md:text-xl">
                  Bergabunglah dengan{" "}
                  <span className="text-white">12.000+</span> pelanggan kami
                  untuk mendapatkan wawasan kesehatan eksklusif setiap hari
                  Rabu.
                </p>
              </div>
              <div className="lg:w-2/5 flex flex-col sm:flex-row gap-4 w-full">
                <input
                  type="email"
                  placeholder="Masukkan email anda"
                  className="flex-grow bg-white/20 border border-white/20 rounded-2xl px-8 py-5 text-white placeholder-white/50 focus:outline-none focus:bg-white/30 transition-all font-bold"
                />
                <button className="bg-white text-accent-red font-black px-10 py-5 rounded-2xl uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl">
                  Berlangganan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
