import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MedicalDisclaimer = ({ onAccept }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasAccepted = localStorage.getItem('medical_disclaimer_accepted');
        if (!hasAccepted) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('medical_disclaimer_accepted', 'true');
        setIsVisible(false);
        if (onAccept) onAccept();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-"
                onClick={() => setIsVisible(false)}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#0B1221] rounded-[2.5rem]  border border-slate-200 dark:border-outline-variant/20 overflow-hidden animate-slide-up">
                {/* Close Button */}
                <button 
                    onClick={() => setIsVisible(false)}
                    className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-10 md:p-14">
                    {/* Header */}
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                            <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                            Peringatan Medis
                        </h2>
                    </div>

                    {/* Content */}
                    <div className="space-y-8 mb-12">
                        <div>
                            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-4 tracking-tight">
                                Pernyataan Penting (Medical Disclaimer)
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                Nadi adalah platform asisten kesehatan berbasis kecerdasan buatan (AI) yang dirancang untuk tujuan informasi dan edukasi. Seluruh analisis yang dihasilkan oleh sistem kami bukan merupakan diagnosis medis resmi.
                            </p>
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Layanan ini tidak menggantikan konsultasi tatap muka dengan dokter atau tenaga medis profesional. Segera hubungi layanan darurat atau fasilitas kesehatan terdekat jika Anda mengalami kondisi kritis.
                        </p>

                        <div className="pt-2">
                            <a href="#" className="inline-flex items-center gap-2 text-nadi-rose font-bold hover:brightness-110 transition-all group">
                                Ketentuan Layanan & Kebijakan Privasi
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Action */}
                    <button 
                        onClick={handleAccept}
                        className="w-full bg-slate-950 text-white dark:bg-white dark:text-[#0B1221] font-bold py-5 rounded-[1.25rem] hover:opacity-90 transition-all active:scale-[0.98]  shadow-black/10 dark:shadow-black/20 text-lg"
                    >
                        Saya Mengerti & Setuju
                    </button>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.4s ease-out forwards;
                }
                .animate-slide-up {
                    animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}} />
        </div>
    );
};

MedicalDisclaimer.propTypes = {
    onAccept: PropTypes.func,
};

export default MedicalDisclaimer;
