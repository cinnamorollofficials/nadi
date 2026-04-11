import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getPublicPenyakitBySlug } from "../../../api/client/medicpedia";

const SECTIONS = [
  { key: "description",      label: "Deskripsi",        color: "text-primary" },
  { key: "causes",           label: "Penyebab",          color: "text-primary" },
  { key: "factors_symptoms", label: "Faktor & Gejala",   color: "text-primary" },
  { key: "diagnosis",        label: "Diagnosis",         color: "text-primary" },
  { key: "when_to_see_doctor", label: "Kapan ke Dokter",  color: "text-primary" },
  { key: "prevention",       label: "Pencegahan",        color: "text-primary" },
];

// Estimate reading time from HTML string
function estimateReadTime(sections, data) {
  const totalWords = sections.reduce((acc, { key }) => {
    const html = data?.[key] || "";
    const text = html.replace(/<[^>]+>/g, " ");
    return acc + text.split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.ceil(totalWords / 200));
}

const PenyakitDetail = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("description");
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRefs = useRef({});
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getPublicPenyakitBySlug(slug);
        setData(res.data?.data);
      } catch {
        toast.error("Informasi penyakit tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const scrolled = Math.max(0, -top);
      const total = height - windowH;
      setScrollProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data]);

  // Active section observer
  useEffect(() => {
    const observers = {};
    SECTIONS.forEach(({ key }) => {
      const el = sectionRefs.current[key];
      if (!el) return;
      observers[key] = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(key); },
        { threshold: 0.3 },
      );
      observers[key].observe(el);
    });
    return () => Object.values(observers).forEach((obs) => obs.disconnect());
  }, [data]);

  const scrollTo = (key) => {
    sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(key);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#0f1117] flex items-center justify-center">
        <div className="space-y-4 w-full max-w-4xl mx-auto px-6">
          <div className="h-10 bg-zinc-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          <div className="h-6 bg-zinc-200 dark:bg-slate-800 rounded-xl animate-pulse w-2/3" />
          <div className="h-64 bg-zinc-200 dark:bg-slate-800 rounded-2xl animate-pulse mt-8" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#0f1117] flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Penyakit Tidak Ditemukan
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Informasi yang Anda cari tidak tersedia atau belum dipublikasikan.
        </p>
        <Link
          to="/medicpedia/penyakit"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
        >
          ← Kembali ke Daftar Penyakit
        </Link>
      </div>
    );
  }

  const readTime = estimateReadTime(SECTIONS, data);
  const availableSections = SECTIONS.filter(({ key }) => !!data[key]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0f1117]" ref={contentRef}>

      {/* ── Scroll Progress Bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary/60 dark:from-slate-950 dark:via-slate-900 dark:to-primary/30">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 md:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8 font-medium">
            <Link to="/medicpedia" className="hover:text-white transition">Medicpedia</Link>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/medicpedia/penyakit" className="hover:text-white transition">Penyakit A-Z</Link>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white/80 truncate max-w-[160px]">{data.name}</span>
          </nav>

          <div className="flex items-start gap-5 md:gap-8">
            {/* Icon / Image */}
            {data.image ? (
              <img
                src={data.image}
                alt={data.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-xl flex-shrink-0"
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl flex-shrink-0">
                🩺
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3 text-white">
                {data.name}
              </h1>
              <p className="text-white/60 text-sm font-medium mb-5">
                Informasi medis lengkap
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-white/80 text-xs font-bold px-3 py-1.5 rounded-full">
                  {readTime} menit baca
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-white/80 text-xs font-bold px-3 py-1.5 rounded-full">
                  Medicpedia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content — single card ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 space-y-10">
        <div className="bg-transparent dark:bg-slate-800/60 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
          {availableSections.map(({ key, label, icon, color }, idx) => {
            const content = data[key];
            return (
              <section
                key={key}
                ref={(el) => (sectionRefs.current[key] = el)}
                id={`section-${key}`}
                className={`scroll-mt-20 ${idx !== 0 ? "border-t border-zinc-100 dark:border-white/5" : ""}`}
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 px-6 md:px-8 py-5 bg-zinc-50/80 dark:bg-slate-900/40">
                  <h2 className={`text-lg md:text-xl font-extrabold tracking-tight ${color}`}>
                    {label}
                  </h2>
                </div>

                {/* Section Content */}
                <div
                  className="px-6 md:px-8 pt-2
                    prose prose-base prose-zinc dark:prose-invert max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight
                    prose-h2:text-xl prose-h3:text-lg
                    prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-7 prose-p:my-3 prose-p:text-base
                    prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-li:leading-7 prose-li:text-base
                    prose-strong:text-slate-800 dark:prose-strong:text-white prose-strong:font-semibold
                    prose-ul:my-3 prose-ol:my-3
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    [&_*]:!text-base"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </section>
            );
          })}
        </div>

        {/* ── CTA — Cek Gejala ── */}
        <div className="bg-gradient-to-br from-primary to-teal-600 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">Fitur AI Nadi</p>
              <h3 className="text-xl md:text-2xl font-bold mb-2">Apakah kamu mengalami gejala {data.name}?</h3>
              <p className="text-white/70 text-sm font-medium leading-relaxed">
                Gunakan AI Symptom Checker kami untuk menganalisis gejalamu dan mendapatkan rekomendasi langkah selanjutnya.
              </p>
            </div>
            <Link
              to="/"
              className="flex-shrink-0 flex items-center gap-2 bg-white text-primary font-bold px-6 py-3.5 rounded-2xl text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Cek Gejala Sekarang
            </Link>
          </div>
        </div>

        {/* ── Bottom Nav ── */}
        <div className="pt-4 border-t border-zinc-200 dark:border-white/5 flex items-center justify-between">
          <Link
            to="/medicpedia/penyakit"
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition font-semibold text-sm group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Penyakit A-Z
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition font-semibold text-sm group"
          >
            Ke atas
            <svg className="w-4 h-4 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenyakitDetail;
