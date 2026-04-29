import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getPublicPenyakitAll } from "../../../api/client/medicpedia";
import Skeleton from "../../../components/Skeleton";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const PAGE_LIMIT = 24;

const PenyakitList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") || "");
  const activeLetter = searchParams.get("letter") || "";
  const [currentPage, setCurrentPage] = useState(() => parseInt(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // SEO
  useEffect(() => {
    document.title = "Penyakit A-Z — Medicpedia Nadi";
    return () => { document.title = "Nadi"; };
  }, []);

  // Sync state with URL (for back/forward navigation)
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== debouncedSearch) {
      setSearchInput(urlSearch);
      setDebouncedSearch(urlSearch);
    }
    const urlPage = parseInt(searchParams.get("page")) || 1;
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
      
      const newParams = new URLSearchParams(searchParams);
      if (searchInput) {
        newParams.set("search", searchInput);
        newParams.delete("letter");
      } else {
        newParams.delete("search");
      }
      newParams.set("page", "1");
      setSearchParams(newParams);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch data whenever filters/page change
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: PAGE_LIMIT,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (activeLetter) params.letter = activeLetter;

      const res = await getPublicPenyakitAll(params);
      setData(res.data?.data?.data || []);
      setTotalPages(res.data?.data?.meta?.total_pages || 1);
      setTotalItems(res.data?.data?.meta?.total_data || 0);
    } catch {
      toast.error("Gagal memuat data penyakit");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, activeLetter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLetterClick = (letter) => {
    const newParams = new URLSearchParams(searchParams);
    if (activeLetter === letter) {
      newParams.delete("letter");
    } else {
      newParams.set("letter", letter);
      setSearchInput("");
      setDebouncedSearch("");
      newParams.delete("search"); // Clear search param if any
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSearchParams({});
    setCurrentPage(1);
  };

  const isFiltered = debouncedSearch || activeLetter;

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: "url('/assets/medicpedia-bg-penyakit.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/30 dark:bg-slate-950/70" />
        <div className="absolute inset-0 opacity-30 dark:opacity-20 mix-blend-overlay pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full  animate-blob" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-400 rounded-full  animate-blob animation-delay-2000" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 leading-tight text-slate-900 dark:text-white">
            Ensiklopedia Penyakit{" "}
            <span className="text-teal-600 dark:text-teal-400">A-Z</span>
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
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full py-4 pl-14 pr-12 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base font-medium border border-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-300 transition shadow-sm"
            />
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500"
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
            {searchInput && (
              <button
                id="penyakit-search-clear"
                onClick={handleClearAll}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                aria-label="Hapus pencarian"
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

      {/* ── Alphabet Filter ── */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {/* "Semua" button */}
            <button
              id="alpha-all"
              onClick={handleClearAll}
              className={`px-3 h-8 rounded-lg text-xs font-bold transition-all duration-200 ${
                !activeLetter && !debouncedSearch
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary"
              }`}
            >
              Semua
            </button>
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                id={`alpha-${letter}`}
                onClick={() => handleLetterClick(letter)}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-200 ${
                  activeLetter === letter
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Meta Info */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="text-surface-on-variant text-sm">
            {loading ? (
              <Skeleton className="w-24 h-4" />
            ) : (
              <span>
                Menampilkan{" "}
                <span className="font-bold text-surface-on">{data.length}</span>{" "}
                dari{" "}
                <span className="font-bold text-surface-on">{totalItems}</span>{" "}
                penyakit
                {activeLetter && (
                  <span className="ml-1">
                    — huruf{" "}
                    <span className="font-extrabold text-primary">
                      {activeLetter}
                    </span>
                  </span>
                )}
                {debouncedSearch && (
                  <span className="ml-1">
                    — kata kunci "
                    <span className="font-semibold text-primary">
                      {debouncedSearch}
                    </span>
                    "
                  </span>
                )}
              </span>
            )}
          </div>

          {isFiltered && (
            <button
              onClick={handleClearAll}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1.5 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hapus filter
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
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
              Penyakit tidak ditemukan
            </h3>
            <p className="text-surface-on-variant text-sm mb-6">
              Coba kata kunci lain atau pilih huruf yang berbeda.
            </p>
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
            >
              Tampilkan semua penyakit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => (
              <Link
                key={item.id}
                to={`/medicpedia/penyakit/${item.slug}`}
                className="group relative bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 flex items-center gap-4 shadow-sm hover:shadow-md"
              >
                {/* Avatar letter */}
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <span className="text-base font-extrabold text-primary">
                    {item.name?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-surface-on group-hover:text-primary transition-colors text-sm leading-tight truncate">
                    {item.name}
                  </h3>
                </div>
                <svg
                  className="w-4 h-4 text-surface-on-variant/40 group-hover:text-primary/60 flex-shrink-0 -translate-x-1 group-hover:translate-x-0 transition-transform"
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
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
            <button
              onClick={() => {
                const nextPage = Math.max(1, currentPage - 1);
                setCurrentPage(nextPage);
                const newParams = new URLSearchParams(searchParams);
                newParams.set("page", nextPage.toString());
                setSearchParams(newParams);
              }}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-variant/30 hover:bg-surface-variant/50 disabled:opacity-30 text-sm font-medium transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Sebelumnya
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set("page", page.toString());
                      setSearchParams(newParams);
                    }}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                      currentPage === page
                        ? "bg-primary text-white "
                        : "bg-surface-variant/30 hover:bg-surface-variant/50 text-surface-on-variant"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                const nextPage = Math.min(totalPages, currentPage + 1);
                setCurrentPage(nextPage);
                const newParams = new URLSearchParams(searchParams);
                newParams.set("page", nextPage.toString());
                setSearchParams(newParams);
              }}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-variant/30 hover:bg-surface-variant/50 disabled:opacity-30 text-sm font-medium transition"
            >
              Berikutnya
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PenyakitList;
