import { useState, useEffect } from "react";
import { getPublicFaqs } from "../../api/faq";
import { Link } from "react-router-dom";
import Skeleton from "../../components/Skeleton";

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaqId, setOpenFaqId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    document.title = "Pusat Bantuan — Nadi";
    setLoading(true);
    getPublicFaqs({ limit: 100 })
      .then((res) => {
        if (res.data && res.data.data) {
          const filtered = res.data.data.filter(
            (item) =>
              item.status?.toLowerCase() === "published" ||
              item.status?.toLowerCase() === "active"
          );
          setFaqs(filtered);
          
          // Set initial active category
          if (filtered.length > 0) {
            const categories = [...new Set(filtered.map(f => f.category || "Umum"))];
            setActiveCategory(categories[0]);
          }
        }
      })
      .catch((err) => console.error("Failed to load FAQs:", err))
      .finally(() => setLoading(false));
    return () => { document.title = "Nadi"; };
  }, []);

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by category
  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    const category = faq.category || "Umum";
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {});

  const categories = Object.keys(groupedFaqs);

  // If search is active and activeCategory has no results, but others do, maybe we should switch?
  // Or just show results for the active category.
  // Let's ensure activeCategory is valid
  useEffect(() => {
    if (categories.length > 0 && (!activeCategory || !categories.includes(activeCategory))) {
        if (searchTerm) {
            // Keep current if possible, or pick first available
            if (!categories.includes(activeCategory)) {
                setActiveCategory(categories[0]);
            }
        }
    }
  }, [categories, activeCategory, searchTerm]);

  return (
    <div className="bg-slate-50 dark:bg-navy-950 min-h-screen transition-colors duration-300">

      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-rose-500/10" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4">
            Pusat <span className="text-primary">Bantuan</span> & FAQ.
          </h1>
          <p className="text-white/60 font-medium text-base mb-8 max-w-xl mx-auto">
            Temukan jawaban cepat untuk pertanyaan umum mengenai layanan Nadi.
          </p>

          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-6 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/20 transition-all font-medium backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 space-y-2">
              <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Kategori</h3>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                </div>
              ) : (
                categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-5 py-4 rounded-2xl font-bold uppercase tracking-tight text-sm transition-all flex items-center justify-between group
                      ${activeCategory === category 
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                        : "bg-white dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/10"
                      }`}
                  >
                    <span>{category}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeCategory === category ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-400"}`}>
                      {groupedFaqs[category]?.length || 0}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* FAQ List */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
              </div>
            ) : activeCategory && groupedFaqs[activeCategory] ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{activeCategory}</h2>
                  <div className="h-px bg-slate-200 dark:bg-white/10 flex-grow" />
                </div>
                
                {groupedFaqs[activeCategory].map((faq) => (
                  <div
                    key={faq.id}
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className="bg-white dark:bg-white/5 border border-slate-200 dark:border-outline-variant/20 rounded-2xl p-6 cursor-pointer group hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-800 dark:text-white/80 font-bold tracking-tight group-hover:text-primary transition-colors">
                        {faq.question}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all transform ${
                          openFaqId === faq.id ? "rotate-180 bg-primary text-white" : "bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:bg-primary group-hover:text-white"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {openFaqId === faq.id && (
                      <div
                        className="mt-4 pt-4 border-t border-slate-100 dark:border-outline-variant/20 text-slate-600 dark:text-white/60 text-sm font-medium leading-relaxed prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-outline-variant/20">
                <p className="text-slate-400 dark:text-white/40 font-bold uppercase tracking-widest text-xs">
                  {searchTerm ? `Tidak ada hasil untuk "${searchTerm}"` : "Pilih kategori untuk melihat FAQ"}
                </p>
              </div>
            )}

            {/* Support CTA */}
            <div className="mt-16 p-10 bg-slate-900 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full  -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Masih ada pertanyaan?</h3>
                  <p className="text-white/60 text-sm font-medium">Tim kami siap membantu Anda 24/7.</p>
                </div>
                <Link to="/contact">
                  <button className="bg-primary text-white font-black px-8 py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all">
                    Hubungi Kami
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
