import { Link } from "react-router-dom";
import Button from "../components/Button";

const team = [
  {
    name: "Dr. Aditya Pratama",
    role: "Chief Medical Officer",
    desc: "Spesialis penyakit dalam dengan 12 tahun pengalaman klinis. Memimpin kurasi basis pengetahuan medis Nadi.",
    initials: "AP",
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Rizky Firmansyah",
    role: "Lead AI Engineer",
    desc: "Arsitek sistem AI probabilistik Nadi. Berpengalaman dalam NLP medis dan machine learning klinis.",
    initials: "RF",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    name: "Sari Dewi Kusuma",
    role: "Head of Product",
    desc: "Memastikan setiap fitur Nadi memberikan pengalaman yang intuitif, aman, dan berdampak nyata bagi pengguna.",
    initials: "SD",
    color: "bg-violet-500/10 text-violet-500",
  },
];

const values = [
  {
    icon: "🧬",
    title: "Berbasis Sains",
    desc: "Setiap rekomendasi didasarkan pada literatur medis terverifikasi dan dikurasi oleh tenaga medis profesional.",
  },
  {
    icon: "🔒",
    title: "Privasi Pertama",
    desc: "Data kesehatan Anda dienkripsi end-to-end. Kami tidak pernah menjual atau membagikan data pribadi Anda.",
  },
  {
    icon: "⚡",
    title: "Akses Instan",
    desc: "Analisis gejala dalam hitungan detik, kapan saja dan di mana saja, tanpa perlu antri atau membuat janji.",
  },
  {
    icon: "🤝",
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
  return (
    <div className="bg-slate-100 dark:bg-navy-950 min-h-screen font-sans transition-colors duration-300">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-24 pb-32">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/15 dark:bg-primary/10 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />
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
              <Button className="bg-primary text-white hover:bg-primary-600 px-8 py-4 text-sm font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
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
                <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 dark:from-primary/5 dark:to-blue-500/5 rounded-[3rem] p-12 border border-primary/10 dark:border-outline-variant/20">
                  <div className="space-y-6">
                    {[
                      { label: "Analisis Gejala", pct: "w-[92%]", color: "bg-primary" },
                      { label: "Akurasi Diagnosis", pct: "w-[98%]", color: "bg-blue-500" },
                      { label: "Kepuasan Pengguna", pct: "w-[95%]", color: "bg-violet-500" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                          <span className="text-sm font-bold text-slate-400">{item.pct.replace("w-[", "").replace("]", "")}</span>
                        </div>
                        <div className="h-2.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${item.pct} ${item.color} rounded-full`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-200 dark:border-outline-variant/20 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl">
                      🧠
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">AI Engine Nadi</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dilatih dari 50.000+ kasus klinis terverifikasi</div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-outline-variant/30 rounded-2xl px-4 py-3 shadow-xl shadow-black/5">
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
                icon: "💬",
                title: "Ceritakan Gejalamu",
                desc: "Ketik atau pilih gejala yang kamu rasakan. AI kami memahami bahasa natural — tidak perlu istilah medis.",
              },
              {
                step: "02",
                icon: "🔬",
                title: "Analisis Probabilistik",
                desc: "Engine AI Nadi mencocokkan gejalamu dengan 1.500+ kondisi medis menggunakan model probabilistik berlapis.",
              },
              {
                step: "03",
                icon: "📋",
                title: "Rekomendasi Terverifikasi",
                desc: "Dapatkan daftar kemungkinan kondisi, tingkat urgensi, dan langkah tindak lanjut yang disarankan dokter.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-outline-variant/20 rounded-[2rem] p-8 group hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-4xl">{item.icon}</div>
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
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">
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
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-outline-variant/20 rounded-[2rem] p-8 text-center group hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl ${member.color} flex items-center justify-center text-xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  {member.initials}
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
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl shadow-primary/20">
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
                  <button className="w-full bg-white text-primary font-bold px-8 py-5 rounded-2xl uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/10">
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
