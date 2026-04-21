import { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const team = [
  {
    name: "Dr. Aditya Pratama",
    role: "Chief Medical Officer",
    desc: "Spesialis penyakit dalam dengan 12 tahun pengalaman klinis. Memimpin kurasi basis pengetahuan medis Nadi.",
    image: "/assets/team-aditya.png",
  },
  {
    name: "Rizky Firmansyah",
    role: "Lead AI Engineer",
    desc: "Arsitek sistem AI probabilistik Nadi. Berpengalaman dalam NLP medis dan machine learning klinis.",
    image: "/assets/team-rizky.png",
  },
  {
    name: "Sari Dewi Kusuma",
    role: "Head of Product",
    desc: "Memastikan setiap fitur Nadi memberikan pengalaman yang intuitif, aman, dan berdampak nyata bagi pengguna.",
    image: "/assets/team-sari.png",
  },
];

const values = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Berbasis Sains",
    desc: "Setiap rekomendasi didasarkan pada literatur medis terverifikasi dan dikurasi oleh tenaga medis profesional.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Privasi Pertama",
    desc: "Data kesehatan Anda dienkripsi end-to-end. Kami tidak pernah menjual atau membagikan data pribadi Anda.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Akses Instan",
    desc: "Analisis gejala dalam hitungan detik, kapan saja dan di mana saja, tanpa perlu antri atau membuat janji.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Transparan",
    desc: "Kami selalu jelas tentang keterbatasan AI kami. Nadi adalah alat bantu, bukan pengganti dokter.",
  },
];

const stats = [
  { value: "1.500+", label: "Kondisi Medis" },
  { value: "98.4%", label: "Akurasi Data" },
  { value: "50K+", label: "Pengguna Aktif" },
  { value: "24/7", label: "Tersedia" },
];

const About = () => {
  useEffect(() => {
    document.title = "Tentang Nadi — Platform Kesehatan Digital Indonesia";
    return () => { document.title = "Nadi"; };
  }, []);

  return (
    <div className="bg-slate-100 dark:bg-navy-950 min-h-screen font-sans transition-colors duration-300">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-24 pb-32">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/15 dark:bg-primary/10 rounded-full [140px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full [120px] translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Tentang Nadi</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-8">
            Kesehatan yang{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Lebih Cerdas
            </span>{" "}
            <br className="hidden md:block" />
            Dimulai dari Sini.
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-medium mb-12">
            Nadi adalah platform kesehatan digital yang menggabungkan kecerdasan buatan
            dengan basis pengetahuan medis terverifikasi — membantu Anda memahami gejala,
            mengambil keputusan lebih baik, dan terhubung dengan layanan kesehatan yang tepat.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/register">
              <Button className="bg-primary text-white hover:bg-primary-600 px-8 py-4 text-sm font-bold rounded-2xl   transition-all hover:scale-105 active:scale-95">
                Mulai Gratis
              </Button>
            </Link>
            <Link to="/medicpedia">
              <Button className="border-2 border-slate-300 dark:border-outline-variant/40 text-slate-700 dark:text-slate-300 hover:border-primary/40 hover:text-primary px-8 py-4 text-sm font-bold rounded-2xl transition-all active:scale-95">
                Jelajahi Medicpedia
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-slate-200 dark:border-outline-variant/20 bg-white dark:bg-navy-900/30">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tight">
                  {s.value}
                </div>
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISI ── */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            {/* Visual */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 dark:from-primary/5 dark:to-blue-500/5 rounded-[3rem] p-10 border border-primary/10 dark:border-outline-variant/20">
                  <div className="space-y-5">
                    {[
                      { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "1.500+ kondisi medis terindeks dan terverifikasi" },
                      { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", text: "Konten dikurasi bersama dokter spesialis Indonesia" },
                      { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", text: "Data dienkripsi end-to-end, tidak pernah dijual" },
                      { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "Respons analisis AI di bawah 3 detik" },
                      { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", text: "Artikel diperbarui setiap bulan oleh tim medis" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-outline-variant/20 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">AI Engine Nadi</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dilatih dari 50.000+ kasus klinis terverifikasi</div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-outline-variant/30 rounded-2xl px-4 py-3  shadow-black/5">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Respons AI</div>
                  <div className="text-2xl font-bold text-primary">&lt; 3 detik</div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="lg:w-1/2">
              <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-4">Misi Kami</p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-8">
                Mendemokratisasi Akses{" "}
                <span className="text-primary">Informasi Kesehatan.</span>
              </h2>
              <div className="space-y-5 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                <p>
                  Di Indonesia, jutaan orang masih kesulitan mengakses informasi kesehatan yang akurat dan terpercaya.
                  Antrian panjang, biaya konsultasi, dan minimnya literasi medis menjadi hambatan nyata.
                </p>
                <p>
                  Nadi hadir untuk mengubah itu. Dengan menggabungkan AI generatif dan basis pengetahuan medis
                  yang dikurasi dokter spesialis, kami memberikan analisis gejala yang cepat, akurat, dan mudah dipahami
                  — langsung di genggaman Anda.
                </p>
                <p>
                  Kami percaya bahwa setiap orang berhak mendapatkan panduan kesehatan berkualitas, tanpa terkecuali.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARA KERJA ── */}
      <section className="py-32 bg-slate-200/40 dark:bg-navy-900/30 border-y border-slate-200 dark:border-outline-variant/20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-4">Teknologi</p>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Bagaimana Nadi Bekerja
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                title: "Ceritakan Gejalamu",
                desc: "Ketik atau pilih gejala yang kamu rasakan. AI kami memahami bahasa natural — tidak perlu istilah medis.",
              },
              {
                step: "02",
                icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
                title: "Analisis Probabilistik",
                desc: "Engine AI Nadi mencocokkan gejalamu dengan 1.500+ kondisi medis menggunakan model probabilistik berlapis.",
              },
              {
                step: "03",
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
                title: "Rekomendasi Terverifikasi",
                desc: "Dapatkan daftar kemungkinan kondisi, tingkat urgensi, dan langkah tindak lanjut yang disarankan dokter.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-outline-variant/20 rounded-[2rem] p-8 group hover:border-primary/30 hover: hover: transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <span className="text-5xl font-bold text-slate-100 dark:text-white/5 leading-none">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-12 max-w-3xl mx-auto bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 flex gap-4">
            <div className="text-2xl flex-shrink-0">⚠️</div>
            <p className="text-sm text-amber-800 dark:text-amber-300/80 font-medium leading-relaxed">
              <span className="font-bold">Penting:</span> Nadi adalah alat bantu informasi, bukan pengganti konsultasi medis profesional.
              Selalu konsultasikan kondisi kesehatan Anda dengan dokter atau tenaga medis yang berkualifikasi.
              Dalam keadaan darurat, segera hubungi <span className="font-bold">119</span>.
            </p>
          </div>
        </div>
      </section>

      {/* ── NILAI ── */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-4">Nilai Kami</p>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Dibangun di Atas Kepercayaan
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-outline-variant/20 rounded-[2rem] p-8 group hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary/20 transition-colors">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                  {v.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIM ── */}
      <section className="py-32 bg-slate-200/40 dark:bg-navy-900/30 border-y border-slate-200 dark:border-outline-variant/20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-4">Tim Kami</p>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Orang-Orang di Balik Nadi
            </h2>
            <p className="mt-6 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Gabungan dokter, insinyur AI, dan desainer produk yang berdedikasi membangun masa depan kesehatan digital Indonesia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-outline-variant/20 rounded-[2rem] p-8 text-center group hover:border-primary/20 hover: hover: transition-all duration-300"
              >
                <div className="relative w-24 h-24 mx-auto mb-6 group">
                  <div className="absolute inset-0 bg-primary/20 rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-2 border-white dark:border-slate-800 ">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                  {member.name}
                </h3>
                <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-4">
                  {member.role}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden  ">
            {/* Decorative lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 50 Q 25 30 50 50 T 100 50" stroke="white" fill="none" strokeWidth="0.5" />
                <path d="M0 65 Q 25 45 50 65 T 100 65" stroke="white" fill="none" strokeWidth="0.5" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
              <div className="lg:w-3/5">
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                  Siap Menjaga Kesehatan <br />
                  Lebih Cerdas?
                </h2>
                <p className="text-teal-50/70 font-medium text-lg leading-relaxed">
                  Bergabunglah dengan ribuan pengguna yang sudah mempercayakan pemantauan kesehatan mereka kepada Nadi.
                  Gratis, cepat, dan selalu tersedia.
                </p>
              </div>
              <div className="lg:w-2/5 flex flex-col sm:flex-row lg:flex-col gap-4 w-full">
                <Link to="/register" className="flex-1">
                  <button className="w-full bg-white text-primary font-bold px-8 py-5 rounded-2xl uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all  shadow-black/10">
                    Daftar Sekarang — Gratis
                  </button>
                </Link>
                <Link to="/medicpedia" className="flex-1">
                  <button className="w-full bg-white/10 border border-white/20 text-white font-bold px-8 py-5 rounded-2xl uppercase tracking-widest text-sm hover:bg-white/20 active:scale-95 transition-all">
                    Jelajahi Medicpedia
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
