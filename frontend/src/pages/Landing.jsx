import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import MedicalDisclaimer from "../components/MedicalDisclaimer";
import SymptomCheckerModal from "../components/SymptomCheckerModal";
import { getPublicFaqs } from "../api/faq";

const Landing = () => {
  const [faqs, setFaqs] = useState([]);
  const [openFaqId, setOpenFaqId] = useState(null);
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);

  useEffect(() => {
    getPublicFaqs({ limit: 10 })
      .then((res) => {
        if (res.data && res.data.data) {
          // Return only active / published FAQs
          setFaqs(
            res.data.data.filter(
              (item) =>
                item.status?.toLowerCase() === "published" ||
                item.status?.toLowerCase() === "active",
            ),
          );
        }
      })
      .catch((err) => console.error("Failed to load FAQs:", err));
  }, []);

  return (
    <div className="bg-slate-100 dark:bg-navy-950 min-h-screen font-sans selection:bg-primary/30 selection:text-primary transition-colors duration-300">
      <MedicalDisclaimer />
      <SymptomCheckerModal
        isOpen={isSymptomModalOpen}
        onClose={() => setIsSymptomModalOpen(false)}
      />
      {/* HERO SECTION */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden transition-all duration-500">
        {/* Animated Gradient Background for Light Mode - Maximum Visibility */}
        <div className="absolute inset-0 z-0 bg-slate-100 dark:bg-transparent transition-colors duration-1000">
          <div className="absolute inset-0 bg-primary/[0.03] dark:bg-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,rgba(20,184,166,0.35)_0,transparent_50%),radial-gradient(at_100%_0%,rgba(244,63,94,0.35)_0,transparent_50%),radial-gradient(at_100%_100%,rgba(59,130,246,0.35)_0,transparent_50%),radial-gradient(at_0%_100%,rgba(20,184,166,0.35)_0,transparent_50%)] animate-mesh opacity-100 dark:opacity-0 transition-opacity duration-1000"></div>
        </div>

        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/25 dark:bg-primary/20 rounded-full blur-[120px] animate-blob" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-600/15 dark:bg-blue-600/10 rounded-full blur-[150px] animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-nadi-rose/20 dark:bg-nadi-rose/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 pointer-events-none mix-blend-overlay"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-3/5 text-left pt-10">
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
                Cerdas Menjaga <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-nadi-rose"></span>{" "}
                Kesehatan
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mb-12 font-medium leading-relaxed">
                Platform kesehatan terintegrasi yang menghubungkan Anda dengan
                layanan medis masa depan melalui teknologi AI dan data yang
                presisi.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <Link to="/register">
                  <Button className="bg-primary text-white hover:bg-primary-600 px-10 py-4 text-sm font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
                    Mulai Sekarang
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:w-2/5 w-full">
              <div className="glass-card rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200 dark:shadow-black relative group overflow-hidden border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-all duration-700" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  Cek Gejala Kamu
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      onClick={() => setIsSymptomModalOpen(true)}
                      placeholder="Apa yang kamu rasakan hari ini?"
                      className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-5 px-6 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium cursor-pointer"
                    />
                    <button
                      onClick={() => setIsSymptomModalOpen(true)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <svg
                        className="w-5 h-5 text-white"
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
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {["Pusing", "Demam", "Batuk", "Mual"].map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setIsSymptomModalOpen(true)}
                        className="text-[10px] font-bold text-slate-400 border border-white/10 px-3 py-1.5 rounded-lg hover:text-white hover:bg-primary/20 hover:border-primary/30 cursor-pointer transition-all uppercase tracking-widest"
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
      <section className="py-20 border-y border-slate-200 dark:border-white/5 bg-slate-200/50 dark:bg-navy-900/20">
        <div className="container mx-auto px-6 overflow-hidden">
          <p className="text-center text-[10px] font-bold tracking-[0.4em] mb-12 text-slate-500 uppercase">
            Dipercaya Oleh Institusi Terkemuka
          </p>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {["Biocare", "Medix", "Vicare", "NeuroBeat", "Health+"].map(
              (name) => (
                <span
                  key={name}
                  className="text-xl font-bold text-slate-500 dark:text-white tracking-widest"
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
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-16">
                Prosedur Analisis yang <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  Presisi & Terukur.
                </span>
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
                    <div className="text-4xl font-bold text-primary/20 group-hover:text-primary transition-colors leading-none">
                      {step.id}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                        {step.title}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-white to-slate-100 rounded-[3rem] p-12 text-slate-900 relative shadow-2xl shadow-primary/10 overflow-hidden group border border-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                <h4 className="text-7xl font-bold tracking-tighter mb-6 text-primary">
                  98.4%
                </h4>
                <h5 className="text-2xl font-bold tracking-tight mb-8">
                  Akurasi Data Medis
                </h5>
                <p className="text-slate-600 font-medium mb-12 max-w-sm leading-relaxed">
                  Kami memanfaatkan machine learning tercanggih untuk memastikan
                  setiap diagnosis memiliki tingkat presisi tertinggi.
                </p>
                <div className="flex gap-12 pt-8 border-t border-slate-200">
                  <div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">
                      12K+
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Data Terolah
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">
                      800+
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
      <section className="py-32 bg-slate-200/50 dark:bg-navy-900/50 border-y border-slate-200 dark:border-white/5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
        <div className="container mx-auto px-6 text-center max-w-4xl mb-20">
          <h2 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            Ekosistem <span className="text-primary">Masa Depan.</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
            Kami membangun fondasi kesehatan digital yang menghubungkan semua
            lini kebutuhan medis Anda dalam satu platform.
          </p>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-card rounded-[2.5rem] p-12 group hover:bg-white/5 transition-all h-[450px] flex flex-col justify-end border-slate-200 dark:border-white/10 relative overflow-hidden bg-slate-100/50 dark:bg-white/5">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-8 border border-primary/20">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
                AI Symptom <br />
                Checker
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md mb-8">
                Asisten virtual yang belajar setiap detik untuk membantu Anda
                mendeteksi potensi penyakit melalui keluhan verbal maupun
                visual.
              </p>
              <Link
                to="#"
                className="text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all"
              >
                Pelajari Sistem
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
            <div className="space-y-6">
              <div className="glass-card rounded-[2rem] p-8 group hover:bg-slate-100 dark:hover:bg-white/5 transition-all border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-primary"
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
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                  Nadi Poin
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                  Dapatkan reward untuk setiap gaya hidup sehat yang Anda
                  jalani.
                </p>
                <div className="h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-gradient-to-r from-primary to-blue-400 shadow-glow-primary" />
                </div>
              </div>
              <div className="glass-card rounded-[2rem] p-8 group hover:bg-blue-600/5 dark:hover:bg-blue-600/10 transition-all border-blue-600/10 dark:border-blue-600/10 bg-blue-50/30 dark:bg-blue-600/5">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-blue-500 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                  Medicpedia
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                  Akses ribuan artikel kesehatan dari sumber terpercaya di
                  Indonesia.
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
                { title: "Tersandikan", icon: "🛡️" },
                { title: "Terdesentralisasi", icon: "🌐" },
                { title: "Privasi Penuh", icon: "👤" },
                { title: "Audit Logging", icon: "📑" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="glass-card p-10 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center text-center group hover:bg-primary/5 hover:border-primary/20 transition-all cursor-default duration-500"
                >
                  <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-300 tracking-widest leading-relaxed">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-10">
                Keamanan Data Anda Adalah{" "}
                <span className="text-primary">Prioritas Mutlak</span> Kami.
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed mb-12">
                Kami menerapkan standar keamanan perbankan internasional untuk
                memastikan setiap riwayat medis dan data pribadi Anda tersimpan
                dalam enkripsi berlapis.
              </p>
              <Button className="border-2 border-primary/20 text-primary font-bold px-10 py-4 uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all rounded-2xl">
                Pelajari Protokol Kami
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-32 border-t border-slate-200 dark:border-white/5 bg-slate-200/50 dark:bg-navy-900/10">
        <div className="container mx-auto px-6 text-center mb-24 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Pertanyaan Umum
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            Semua yang perlu Anda ketahui tentang ekosistem kami
          </p>
        </div>

        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-4">
            {faqs.length > 0 ? (
              faqs.slice(0, 5).map((faq) => (
                <div
                  key={faq.id}
                  onClick={() =>
                    setOpenFaqId(openFaqId === faq.id ? null : faq.id)
                  }
                  className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl p-8 cursor-pointer group hover:bg-slate-50 dark:hover:bg-white/10 hover:border-primary/40 dark:hover:border-primary/20 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 font-bold tracking-tight group-hover:text-primary dark:group-hover:text-white transition-colors">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-all text-slate-500 transform ${openFaqId === faq.id ? "rotate-180 bg-primary text-white" : "group-hover:bg-primary group-hover:text-white"}`}
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
                      className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed prose dark:prose-invert max-w-none break-words overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 italic py-10 font-medium">
                Belum ada pertanyaan umum.
              </div>
            )}

            {/* View All Button */}
            {faqs.length > 5 && (
              <div className="mt-12 text-center">
                <Link to="/faq">
                  <button className="group relative px-8 py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all active:scale-95 text-slate-500 dark:text-slate-400">
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all" />
                    <span className="relative group-hover:text-primary dark:group-hover:text-white font-bold tracking-widest text-sm flex items-center justify-center gap-3">
                      Lihat Semua FAQ
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="bg-primary rounded-[3rem] p-12 md:p-24 relative overflow-hidden group shadow-2xl shadow-primary/20 transform-gpu transition-all duration-700">
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
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-8">
                  Dapatkan Wawasan <br />
                  Kesehatan Mingguan.
                </h2>
                <p className="text-teal-50/70 font-bold text-lg md:text-xl">
                  Bergabunglah dengan{" "}
                  <span className="text-white underline decoration-white/30 underline-offset-8">
                    12.000+
                  </span>{" "}
                  pelanggan kami untuk mendapatkan wawasan kesehatan eksklusif
                  setiap hari Rabu.
                </p>
              </div>
              <div className="lg:w-2/5 flex flex-col sm:flex-row gap-4 w-full">
                <input
                  type="email"
                  placeholder="Masukkan email anda"
                  className="flex-grow bg-white/20 border border-white/20 rounded-2xl px-8 py-5 text-white placeholder-white/50 focus:outline-none focus:bg-white/30 transition-all font-bold"
                />
                <button className="bg-white text-primary font-bold px-10 py-5 rounded-2xl uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/10">
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
