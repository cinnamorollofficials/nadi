import { Link } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-6 relative overflow-hidden">
            {/* Background elements to match the dark theme aesthetics */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-900/40 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 text-center max-w-lg">
                <h1 className="text-[120px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 leading-none">
                    404
                </h1>
                <h2 className="mt-8 text-3xl font-bold text-white tracking-tight">
                    Halaman Tidak Ditemukan
                </h2>
                <p className="mt-4 text-surface-on-variant text-lg">
                    Maaf, kami tidak dapat menemukan halaman yang Anda cari. 
                    Mungkin url yang Anda tuju salah atau halaman sudah dihapus.
                </p>
                
                <div className="mt-10">
                    <Link 
                        to="/" 
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-full transition-all active:scale-95 hover:shadow-lg hover:shadow-primary-600/20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
