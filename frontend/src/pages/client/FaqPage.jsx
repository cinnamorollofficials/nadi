import { useState, useEffect } from "react";
import { getPublicFaqs } from "../../api/faq";
import { Link } from "react-router-dom";

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaqId, setOpenFaqId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getPublicFaqs({ limit: 100 })
      .then((res) => {
        if (res.data && res.data.data) {
          setFaqs(res.data.data.filter((item) => item.status?.toLowerCase() === "published" || item.status?.toLowerCase() === "active"));
        }
      })
      .catch((err) => console.error("Failed to load FAQs:", err))
      .finally(() => setLoading(false));
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

  return (
    <div className="bg-slate-100 dark:bg-navy-950 min-h-screen transition-colors duration-300">

      {/* Hero Section - half screen */}
      <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary/80 dark:from-navy-950 dark:via-slate-900 dark:to-slate-900">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl pt-20 pb-10">
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
            Pusat <span className="text-rose-400">Bantuan</span> & FAQ.
          </h1>
          <p className="text-white/60 font-medium text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Temukan jawaban cepat untuk pertanyaan umum mengenai layanan dan ekosistem Nadi.
          </p>

          {/* Search inside hero */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Cari pertanyaan atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl py-5 px-8 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/20 transition-all font-medium text-base backdrop-blur-sm"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-accent-red/20 border-t-accent-red rounded-full animate-spin" />
            </div>
          ) : Object.keys(groupedFaqs).length > 0 ? (
            <div className="space-y-16">
              {Object.entries(groupedFaqs).map(([category, items]) => (
                <div key={category}>
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{category}</h2>
                    <div className="h-px bg-slate-200 dark:bg-white/10 flex-grow" />
                  </div>
                  <div className="space-y-4">
                    {items.map((faq) => (
                      <div
                        key={faq.id}
                        onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                        className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl p-6 cursor-pointer group hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm hover:shadow-md dark:shadow-none"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 dark:text-white/60 font-black uppercase italic tracking-tight group-hover:text-primary dark:group-hover:text-white transition-colors">
                            {faq.question}
                          </span>
                          <div
                            className={`w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center transition-all text-slate-400 dark:text-white/20 transform ${
                              openFaqId === faq.id ? "rotate-180 bg-accent-red text-white" : "group-hover:bg-accent-red group-hover:text-white"
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {openFaqId === faq.id && (
                          <div
                            className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 text-slate-600 dark:text-white/60 text-sm font-medium leading-relaxed prose dark:prose-invert max-w-none break-words overflow-x-auto"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
              <p className="text-slate-400 dark:text-white/40 font-bold italic uppercase tracking-widest text-sm">Tidak ada hasil yang ditemukan untuk "{searchTerm}"</p>
            </div>
          )}

          <div className="mt-20 p-12 bg-rose-500 rounded-[3rem] text-center shadow-2xl shadow-rose-500/20">
             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Masih ada pertanyaan?</h3>
             <p className="text-white/80 font-bold mb-8 max-w-md mx-auto">Tim kami siap membantu Anda 24/7 untuk setiap kendala medis atau teknis.</p>
             <Link to="/contact">
                <button className="bg-white text-rose-500 font-black px-10 py-4 rounded-2xl uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl">
                    Hubungi Kami
                </button>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
