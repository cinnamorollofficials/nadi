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
    document.title = "Nadi — Platform Kesehatan Digital Indonesia";
    return () => { document.title = "Nadi"; };
  }, []);

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
    <div className="bg-zinc-50 dark:bg-navy-950 min-h-screen font-sans selection:bg-primary/30 selection:text-primary transition-colors duration-300">
      <MedicalDisclaimer />
      <SymptomCheckerModal
        isOpen={isSymptomModalOpen}
        onClose={() => setIsSymptomModalOpen(false)}
      />
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden transition-all duration-500 bg-medical-grid">
        {/* Refined Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.03] to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-zinc-50 dark:from-navy-900 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-left">
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-8">
                Analisis Medis Akurat,<br />
                <span className="text-primary">
                  Di Genggaman Anda.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mb-10 font-medium leading-relaxed">
                Platform kesehatan terintegrasi berbasis data klinis terverifikasi. Pahami gejala Anda dalam hitungan detik dengan AI yang dilatih oleh pakar medis.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/register">
                  <Button className="bg-primary text-white hover:bg-primary-600 px-8 py-4 text-sm font-bold rounded-2xl transition-all hover:-translate-y-0.5 active:translate-y-0">
                    Mulai Konsultasi Gratis
                  </Button>
                </Link>
                <button
                  onClick={() => setIsSymptomModalOpen(true)}
                  className="flex items-center gap-2.5 px-8 py-4 rounded-2xl border border-slate-300 dark:border-outline-variant/30 text-slate-700 dark:text-slate-300 hover:border-primary/50 hover:text-primary text-sm font-bold transition-all"
                >
                  Cek Gejala
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-zinc-200 dark:border-white/5">
                {[
                  { value: "1.500+", label: "Kondisi Medis" },
                  { value: "98.4%", label: "Akurasi Klinis" },
                  { value: "ISO 27001", label: "Data Certified" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 w-full relative">
              <div className="relative z-10 animate-fluid-float">
                <div className="relative glass-card p-2 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden group">
                  <img 
                    src="/hero_medical.png" 
                    alt="Nadi App Professional Context" 
                    className="w-full h-auto rounded-[2rem] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF STRIP */}
      <section className="py-10 border-y border-zinc-200 dark:border-white/5 bg-zinc-200 dark:bg-slate-900/80">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "1.500+", label: "Artikel Penyakit" },
              { value: "400+", label: "Artikel Nutrisi" },
              { value: "98.4%", label: "Akurasi AI" },
              { value: "24/7", label: "Tersedia Gratis" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-primary mb-1">{s.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANALYSIS STEPS SECTION */}
      <section className="py-16 md:py-32 bg-zinc-50 dark:bg-[#0f1117]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="lg:w-1/2 w-full">
              <h2 className="text-3xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-10 md:mb-16">
                Prosedur Analisis yang{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  Presisi & Terukur.
                </span>
              </h2>
              <div className="space-y-8 md:space-y-12">
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
                  <div key={step.id} className="flex gap-5 md:gap-8 group">
                    <div className="text-3xl md:text-4xl font-bold text-primary/20 group-hover:text-primary transition-colors leading-none flex-shrink-0">
                      {step.id}
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                        {step.title}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm md:text-base">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-slate-900 dark:text-white relative border border-slate-200 dark:border-white/10 overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 transition-all duration-700" />
                <h4 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4 md:mb-6 text-primary">
                  98.4%
                </h4>
                <h5 className="text-xl md:text-2xl font-bold tracking-tight mb-4 md:mb-8">
                  Akurasi Data Medis
                </h5>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8 md:mb-12 max-w-sm leading-relaxed text-sm md:text-base">
                  Kami memanfaatkan machine learning tercanggih untuk memastikan
                  setiap diagnosis memiliki tingkat presisi tertinggi.
                </p>
                <div className="flex gap-8 md:gap-12 pt-6 md:pt-8 border-t border-zinc-200 dark:border-white/10">
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                      12K+
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Data Terolah
                    </div>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1">
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
      <section className="py-16 md:py-32 bg-zinc-50 dark:bg-[#0f1117] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: Content */}
            <div className="lg:w-1/3">
              <div className="sticky top-24">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4 block">Ekosistem Nadi</span>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
                  Solusi Medis <br />
                  <span className="text-primary italic">Yang Lengkap.</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-base leading-relaxed mb-8">
                  Kami membangun fondasi kesehatan digital yang menghubungkan semua lini kebutuhan medis Anda dalam satu platform yang terintegrasi dan aman.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">ISO 27001 Data Privacy</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">HIPAA Compliant Cloud</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Grid */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 group relative h-80 rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-white/10">
                <img src="/medicpedia_visual.png" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Medicpedia Illustration" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-10 flex flex-col justify-end">
                  <h3 className="text-3xl font-bold text-white mb-2">Medicpedia</h3>
                  <p className="text-slate-300 text-sm max-w-sm mb-6">Akses ribuan artikel kesehatan dari sumber terpercaya di Indonesia.</p>
                  <Link to="/medicpedia" className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                    Jelajahi Sekarang <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              </div>

              <div className="glass-card rounded-[2.5rem] p-8 border border-zinc-200 dark:border-white/5 group hover:border-primary/30 transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">AI Symptom Checker</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">Asisten virtual yang belajar setiap detik untuk membantu Anda mendeteksi potensi penyakit.</p>
              </div>

              <div className="bg-primary rounded-[2.5rem] p-8 group relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Nadi Poin Reward</h3>
                <p className="text-white/70 text-sm font-medium leading-relaxed mb-6">Dapatkan reward untuk setiap gaya hidup sehat yang Anda jalani.</p>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY SECTION */}
      <section className="py-16 md:py-32 bg-zinc-50 dark:bg-[#0f1117]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="lg:w-1/2 w-full grid grid-cols-2 gap-3 md:gap-4">
              {[
                { title: "Tersandikan", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                { title: "Terdesentralisasi", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" },
                { title: "Privasi Penuh", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                { title: "Audit Logging", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="glass-card p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-zinc-100 dark:bg-slate-800/60 border border-zinc-200 dark:border-white/10 flex flex-col items-center justify-center text-center group hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/20 transition-all cursor-default duration-500"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 md:mb-6 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                    <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <div className="text-[10px] md:text-xs font-bold uppercase text-slate-500 dark:text-slate-300 tracking-widest leading-relaxed">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:w-1/2 w-full">
              <h2 className="text-3xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 md:mb-10">
                Keamanan Data Anda Adalah{" "}
                <span className="text-primary">Prioritas Mutlak</span> Kami.
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg leading-relaxed mb-8 md:mb-12">
                Kami menerapkan standar keamanan perbankan internasional untuk
                memastikan setiap riwayat medis dan data pribadi Anda tersimpan
                dalam enkripsi berlapis.
              </p>
              <Link to="/about">
                <Button className="border-2 border-primary/30 text-primary font-bold px-8 md:px-10 py-3 md:py-4 uppercase tracking-widest text-xs hover:bg-primary hover:text-white hover:border-primary transition-all rounded-2xl">
                  Pelajari Protokol Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="py-16 md:py-32 bg-zinc-200 dark:bg-slate-900/60 border-y border-zinc-300 dark:border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20">
            <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-3">Testimoni</p>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Dipercaya Ribuan Pengguna
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Rina Kusumawati",
                role: "Ibu Rumah Tangga, Jakarta",
                avatar: "RK",
                color: "bg-primary/10 text-primary",
                rating: 5,
                text: "Nadi sangat membantu saya memahami gejala anak saya sebelum ke dokter. Analisisnya akurat dan penjelasannya mudah dimengerti. Tidak perlu panik dulu sebelum tahu kondisinya.",
              },
              {
                name: "Budi Santoso",
                role: "Mahasiswa Kedokteran, Surabaya",
                avatar: "BS",
                color: "bg-blue-500/10 text-blue-500",
                rating: 5,
                text: "Sebagai mahasiswa kedokteran, saya terkesan dengan kualitas database medis Nadi. Referensinya komprehensif dan selalu diperbarui. Jadi alat belajar yang sangat berguna.",
              },
              {
                name: "Dewi Anggraini",
                role: "Karyawan Swasta, Bandung",
                avatar: "DA",
                color: "bg-violet-500/10 text-violet-500",
                rating: 5,
                text: "Fitur cek gejala AI-nya luar biasa. Dalam 2 menit saya sudah tahu harus ke dokter spesialis apa. Hemat waktu dan biaya konsultasi awal. Sangat recommended!",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-zinc-50 dark:bg-slate-800/70 border border-zinc-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col gap-5 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-sm flex-1">
                  "{t.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-white/10">
                  <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 md:py-32 border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#0f1117]">
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
                  className="bg-zinc-50 dark:bg-slate-800/60 border border-zinc-200 dark:border-white/10 rounded-3xl p-8 cursor-pointer group hover:bg-zinc-100 dark:hover:bg-slate-700/60 hover:border-primary/40 dark:hover:border-primary/30 transition-all"
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
                      className="mt-4 pt-4 border-t border-zinc-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed prose dark:prose-invert max-w-none break-words overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 py-10 font-medium">
                Belum ada pertanyaan umum.
              </div>
            )}

            {/* View All Button */}
            {faqs.length > 5 && (
              <div className="mt-12 text-center">
                <Link to="/faq">
                  <button className="group relative px-8 py-4 bg-zinc-100 dark:bg-slate-800/60 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all active:scale-95 text-slate-500 dark:text-slate-400">
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
      <section id="contact" className="py-16 md:py-32 bg-zinc-100 dark:bg-slate-900/60">
        <div className="container mx-auto px-6">
          <div className="bg-primary rounded-[2rem] md:rounded-[3rem] p-8 md:p-24 relative overflow-hidden group transform-gpu transition-all duration-700">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 50 Q 25 30 50 50 T 100 50" stroke="white" fill="none" strokeWidth="0.5" />
                <path d="M0 60 Q 25 40 50 60 T 100 60" stroke="white" fill="none" strokeWidth="0.5" />
              </svg>
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 md:gap-12 text-center lg:text-left">
              <div className="lg:w-3/5">
                <h2 className="text-3xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-4 md:mb-8">
                  Dapatkan Wawasan <br className="hidden md:block" />
                  Kesehatan Mingguan.
                </h2>
                <p className="text-teal-50/70 font-bold text-base md:text-xl">
                  Bergabunglah dengan{" "}
                  <span className="text-white underline decoration-white/30 underline-offset-8">
                    12.000+
                  </span>{" "}
                  pelanggan kami untuk mendapatkan wawasan kesehatan eksklusif
                  setiap hari Rabu.
                </p>
              </div>
              <div className="lg:w-2/5 flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
                <input
                  type="email"
                  placeholder="Masukkan email anda"
                  className="flex-grow bg-white/20 border border-white/20 rounded-2xl px-6 md:px-8 py-4 md:py-5 text-white placeholder-white/50 focus:outline-none focus:bg-white/30 transition-all font-bold text-sm md:text-base"
                />
                <button className="bg-white text-primary font-bold px-8 md:px-10 py-4 md:py-5 rounded-2xl uppercase tracking-widest text-xs md:text-sm hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
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
