import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getPublicPenyakitAll } from "../../../api/client/medicpedia";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const PenyakitList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getPublicPenyakitAll({
          page: currentPage,
          limit: 18,
          search: debouncedSearch,
        });
        setData(res.data?.data?.data || []);
        setTotalPages(res.data?.data?.meta?.total_pages || 1);
        setTotalItems(res.data?.data?.meta?.total_data || 0);
      } catch {
        toast.error("Gagal memuat data penyakit");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, debouncedSearch]);

  const handleLetterFilter = (letter) => {
    if (activeLetter === letter) {
      setActiveLetter("");
      setSearchTerm("");
    } else {
      setActiveLetter(letter);
      setSearchTerm(letter);
    }
    setCurrentPage(1);
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "").slice(0, 120) + "...";
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          backgroundImage: "url('/assets/medicpedia-bg-penyakit.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-white/30 dark:bg-slate-950/70" />
        <div className="absolute inset-0 opacity-30 dark:opacity-20 mix-blend-overlay pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-400 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 leading-tight text-slate-900 dark:text-white">
            Ensiklopedia Penyakit <span className="text-teal-600 dark:text-teal-400">A-Z</span>
          </h1>
          <p className="text-slate-600 dark:text-teal-100/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Temukan informasi lengkap mengenai penyakit, gejala, penyebab, cara
            diagnosis dan pencegahannya.
          </p>
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <input
              id="penyakit-search"
              type="text"
              placeholder="Cari nama penyakit..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setActiveLetter("");
              }}
              className="w-full py-4 pl-14 pr-6 rounded-2xl text-surface-on bg-white placeholder-surface-on-variant/60 text-base font-medium shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
            />
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-on-variant"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveLetter("");
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-on-variant hover:text-surface-on transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Alphabet Filter */}
      <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur border-b border-outline-variant/30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                id={`alpha-${letter}`}
                onClick={() => handleLetterFilter(letter)}
                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all duration-200
                                    ${
                                      activeLetter === letter
                                        ? "bg-primary text-white shadow-md scale-110"
                                        : "bg-surface-variant/40 text-surface-on-variant hover:bg-primary/10 hover:text-primary"
                                    }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Meta Info */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-surface-on-variant text-sm">
            {loading ? (
              "Memuat..."
            ) : (
              <span>
                Menampilkan{" "}
                <span className="font-bold text-surface-on">{data.length}</span>{" "}
                dari{" "}
                <span className="font-bold text-surface-on">{totalItems}</span>{" "}
                penyakit
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-surface-variant/20 animate-pulse h-52"
              />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 bg-surface-variant/30 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-surface-on-variant/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-surface-on mb-2">
              Tidak ditemukan
            </h3>
            <p className="text-surface-on-variant text-sm">
              Coba kata kunci lain atau hapus filter alfabet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((item) => (
              <Link
                key={item.id}
                to={`/medicpedia/penyakit/${item.slug}`}
                className="group relative bg-surface-variant/10 border border-outline-variant/20 rounded-2xl p-6 hover:border-primary/30 hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
              >
                {/* Letter badge */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-black text-lg">
                    {item.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                {/* Icon */}
                <div className="w-10 h-10 mb-4 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-surface-on group-hover:text-primary transition-colors text-base mb-2 pr-10">
                  {item.name}
                </h3>
                <p className="text-surface-on-variant text-sm leading-relaxed line-clamp-3">
                  {stripHtml(item.description)}
                </p>
                <div className="mt-4 flex items-center gap-1 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Baca selengkapnya
                  <svg
                    className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
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
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-surface-variant/30 hover:bg-surface-variant/50 disabled:opacity-30 text-sm font-medium transition"
            >
              ← Prev
            </button>
            <span className="px-4 py-2 text-sm text-surface-on-variant">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-surface-variant/30 hover:bg-surface-variant/50 disabled:opacity-30 text-sm font-medium transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PenyakitList;
