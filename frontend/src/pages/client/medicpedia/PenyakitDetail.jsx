import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getPublicPenyakitBySlug } from "../../../api/client/medicpedia";
import Skeleton from "../../../components/Skeleton";

const SECTIONS = [
  { key: "description", label: "Deskripsi", color: "text-primary" },
  { key: "causes", label: "Penyebab", color: "text-primary" },
  { key: "factors_symptoms", label: "Faktor & Gejala", color: "text-primary" },
  { key: "diagnosis", label: "Diagnosis", color: "text-primary" },
  {
    key: "when_to_see_doctor",
    label: "Kapan ke Dokter",
    color: "text-primary",
  },
  { key: "prevention", label: "Pencegahan", color: "text-primary" },
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
        const item = res.data?.data;
        setData(item);
        if (item?.name) {
          document.title = `${item.name} — Medicpedia Nadi`;
        }
      } catch {
        toast.error("Informasi penyakit tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => { document.title = "Nadi"; };
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
      setScrollProgress(
        total > 0 ? Math.min(100, (scrolled / total) * 100) : 0,
      );
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
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(key);
        },
        { threshold: 0.3 },
      );
      observers[key].observe(el);
    });
    return () => Object.values(observers).forEach((obs) => obs.disconnect());
  }, [data]);

  const scrollTo = (key) => {
    sectionRefs.current[key]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveSection(key);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#0f1117] flex items-center justify-center">
        <div className="space-y-6 w-full max-w-4xl mx-auto px-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="space-y-4 pt-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-64 w-full mt-8" />
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full  -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full  pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 py-14 md:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8 font-medium">
            <Link to="/medicpedia" className="hover:text-white transition">
              Medicpedia
            </Link>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link
              to="/medicpedia/penyakit"
              className="hover:text-white transition"
            >
              Penyakit A-Z
            </Link>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-white/80 truncate max-w-[160px]">
              {data.name}
            </span>
          </nav>

          <div className="flex items-start gap-5 md:gap-8">
            {/* Icon / Image */}
            {data.image ? (
              <img
                src={data.image}
                alt={data.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white/20  flex-shrink-0"
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
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-white/80 text-xs font-bold px-3 py-1.5 rounded-full">
                  {readTime} menit baca
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-white/80 text-xs font-bold px-3 py-1.5 rounded-full">
                  Medicpedia
                </span>
                <Link
                  to={`/new-check?topic=${encodeURIComponent(data.name)}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold px-4 py-1.5 rounded-full transition-all hover:scale-105  shadow-emerald-500/20 md:hidden"
                >
                  Tanya AI
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content Layout ── */}
      <div className="container mx-auto px-6 py-6 md:py-10 flex flex-col md:flex-row gap-8 items-start">
        {/* ── Mobile Sticky Shortcuts ── */}
        <div className="md:hidden sticky top-20 z-20 bg-zinc-50/95 dark:bg-[#0f1117]/95 backdrop- p-2 rounded-2xl flex items-center gap-4 border border-zinc-200/50 dark:border-white/10  shadow-black/5 w-full">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {availableSections.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => scrollTo(key)}
                className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeSection === key
                    ? "bg-primary text-white   scale-105"
                    : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300  hover:bg-zinc-100 dark:hover:bg-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Content Area ── */}
        <div className="flex-1 min-w-0 lg:pr-12 xl:pr-20 space-y-8 md:space-y-10">
          <div className="space-y-12">
            {availableSections.map(({ key, label, icon, color }, idx) => {
              const content = data[key];
              return (
                <section
                  key={key}
                  ref={(el) => (sectionRefs.current[key] = el)}
                  id={`section-${key}`}
                  className="scroll-mt-36"
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-3 pb-4">
                    <h2
                      className={`text-xl md:text-2xl font-extrabold tracking-tight`}
                    >
                      {label}
                    </h2>
                  </div>

                  {/* Section Content */}
                  <div
                    className="
                      w-full min-w-0 break-words overflow-x-hidden
                      prose prose-base md:prose-lg prose-zinc dark:prose-invert max-w-none
                      prose-headings:font-bold prose-headings:tracking-tight
                      prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                      prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:my-4
                      prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-li:leading-relaxed
                      prose-strong:text-slate-800 dark:prose-strong:text-white prose-strong:font-semibold
                      prose-ul:my-4 prose-ol:my-4
                      prose-a:text-primary prose-a:break-all hover:prose-a:underline
                      [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl
                      [&_iframe]:max-w-full [&_video]:max-w-full
                      [&_table]:block [&_table]:overflow-x-auto [&_table]:max-w-full [&_table]:w-full
                      [&_*]:max-w-full [&_*]:break-words"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </section>
              );
            })}
          </div>

          {/* ── CTA — Cek Gejala ── */}
          <div className="bg-gradient-to-br from-primary to-teal-600 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20  pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">
                  Fitur AI Nadi
                </p>
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Apakah kamu mengalami gejala {data.name}?
                </h3>
                <p className="text-white/70 text-sm font-medium leading-relaxed">
                  Gunakan AI Symptom Checker kami untuk menganalisis gejalamu
                  dan mendapatkan rekomendasi langkah selanjutnya.
                </p>
              </div>
              <Link
                to="/"
                className="flex-shrink-0 flex items-center gap-2 bg-white text-primary font-bold px-6 py-3.5 rounded-2xl text-sm hover:scale-105 active:scale-95 transition-all  shadow-black/10 whitespace-nowrap"
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
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
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
              <svg
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Kembali ke Penyakit A-Z
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition font-semibold text-sm group"
            >
              Ke atas
              <svg
                className="w-4 h-4 group-hover:-translate-y-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Desktop Right Sidebar (Sticky) ── */}
        <div className="hidden md:block w-72 flex-shrink-0 sticky top-24">
          <div className="bg-white/80 dark:bg-slate-800/60 backdrop- p-6 rounded-3xl border border-zinc-200/50 dark:border-white/10 ">
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
              Daftar Isi
            </h3>
            <div className="flex flex-col gap-2 relative">
              {/* Highlight Track */}
              <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-slate-700/50 rounded-full" />

              {availableSections.map(({ key, label }) => {
                const isActive = activeSection === key;
                return (
                  <button
                    key={key}
                    onClick={() => scrollTo(key)}
                    className={`relative text-left pl-7 pr-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "text-primary bg-primary/10  "
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    {/* Active Indicator Dot */}
                    <div
                      className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all ${
                        isActive ? "bg-primary scale-125" : "bg-transparent"
                      }`}
                    />
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-white/10 text-center">
              <Link
                to={`/new-check?topic=${encodeURIComponent(data.name)}`}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-5 py-3 rounded-2xl font-bold  shadow-emerald-500/20 transition-transform hover:scale-105 w-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Diskusi AI
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* ── Floating Ask AI (Mobile) ── */}
      <div className="md:hidden fixed bottom-6 right-4 z-50">
        <Link
          to={`/new-check?topic=${encodeURIComponent(data.name)}`}
          className="flex items-center gap-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white pl-4 pr-5 h-14 rounded-full  hover:scale-105 active:scale-95 transition-all font-bold text-sm"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Tanya AI
        </Link>
      </div>
    </div>
  );
};

export default PenyakitDetail;
