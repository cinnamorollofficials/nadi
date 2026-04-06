import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getPublicPenyakitBySlug } from '../../../api/client/medicpedia';

const SECTIONS = [
    { key: 'description', label: 'Deskripsi', icon: '📋', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { key: 'causes', label: 'Penyebab', icon: '🔍', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { key: 'factors_symptoms', label: 'Faktor & Gejala', icon: '⚠️', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { key: 'diagnosis', label: 'Diagnosis', icon: '🩺', color: 'text-green-500', bg: 'bg-green-500/10' },
    { key: 'when_to_see_doctor', label: 'Kapan ke Dokter', icon: '🏥', color: 'text-red-500', bg: 'bg-red-500/10' },
    { key: 'prevention', label: 'Pencegahan', icon: '🛡️', color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

const PenyakitDetail = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('description');
    const sectionRefs = useRef({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getPublicPenyakitBySlug(slug);
                setData(res.data?.data);
            } catch {
                toast.error('Informasi penyakit tidak ditemukan');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    useEffect(() => {
        const observers = {};
        SECTIONS.forEach(({ key }) => {
            const el = sectionRefs.current[key];
            if (!el) return;
            observers[key] = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveSection(key); },
                { threshold: 0.4 }
            );
            observers[key].observe(el);
        });
        return () => Object.values(observers).forEach(obs => obs.disconnect());
    }, [data]);

    const scrollTo = (key) => {
        sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(key);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="space-y-4 w-full max-w-4xl mx-auto px-6">
                    <div className="h-10 bg-surface-variant/30 rounded-2xl animate-pulse" />
                    <div className="h-6 bg-surface-variant/20 rounded-xl animate-pulse w-2/3" />
                    <div className="h-64 bg-surface-variant/15 rounded-2xl animate-pulse mt-8" />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-center px-6">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">🔍</span>
                </div>
                <h1 className="text-2xl font-bold text-surface-on mb-3">Penyakit Tidak Ditemukan</h1>
                <p className="text-surface-on-variant mb-8">Informasi yang Anda cari tidak tersedia atau belum dipublikasikan.</p>
                <Link to="/medicpedia/penyakit" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition">
                    ← Kembali ke Daftar Penyakit
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-primary-900 text-white">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-red-300 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
                        <Link to="/medicpedia/penyakit" className="hover:text-white transition">Penyakit A-Z</Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white/80">{data.name}</span>
                    </nav>
                    <div className="flex items-start gap-6">
                        {data.image && (
                            <img
                                src={data.image}
                                alt={data.name}
                                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-xl flex-shrink-0"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        )}
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-3 uppercase tracking-wider">
                                <span className="w-2 h-2 bg-green-400 rounded-full" /> Dipublikasikan
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3">{data.name}</h1>
                            <p className="text-white/70 text-sm">Informasi lengkap tentang penyakit ini tersedia dalam {SECTIONS.length} bagian di bawah.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Section Nav */}
            <div className="sticky top-0 z-20 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex overflow-x-auto gap-1 py-3 scrollbar-none">
                        {SECTIONS.map(({ key, label, icon, color }) => (
                            <button
                                key={key}
                                id={`nav-${key}`}
                                onClick={() => scrollTo(key)}
                                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                                    ${activeSection === key
                                        ? `bg-primary text-white shadow-md`
                                        : `text-surface-on-variant hover:bg-surface-variant/40 hover:${color}`
                                    }`}
                            >
                                <span>{icon}</span>
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
                {SECTIONS.map(({ key, label, icon, color, bg }) => {
                    const content = data[key];
                    if (!content) return null;
                    return (
                        <section
                            key={key}
                            ref={(el) => sectionRefs.current[key] = el}
                            id={`section-${key}`}
                            className="scroll-mt-24"
                        >
                            {/* Section Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center text-xl flex-shrink-0`}>
                                    {icon}
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-extrabold ${color} tracking-tight`}>{label}</h2>
                                    <div className="w-16 h-1 mt-1.5 rounded-full bg-current opacity-30 ${color}" />
                                </div>
                            </div>
                            {/* WYSIWYG Content Render */}
                            <div
                                className="prose prose-neutral dark:prose-invert max-w-none text-surface-on leading-relaxed
                                    prose-headings:font-bold prose-headings:text-surface-on
                                    prose-p:text-surface-on/80 prose-p:leading-7
                                    prose-li:text-surface-on/80 prose-li:leading-7
                                    prose-strong:text-surface-on prose-strong:font-semibold
                                    bg-surface-variant/10 border border-outline-variant/20 rounded-2xl p-6 md:p-8"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </section>
                    );
                })}

                {/* Back */}
                <div className="pt-8 border-t border-outline-variant/30 flex items-center justify-between">
                    <Link
                        to="/medicpedia/penyakit"
                        className="flex items-center gap-2 text-surface-on-variant hover:text-primary transition font-medium text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Penyakit A-Z
                    </Link>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2 text-surface-on-variant hover:text-primary transition font-medium text-sm"
                    >
                        Ke atas
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PenyakitDetail;
