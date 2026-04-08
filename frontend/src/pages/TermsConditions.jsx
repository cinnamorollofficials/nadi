import { Link } from "react-router-dom";

const TermsConditions = () => {
  return (
    <div className="bg-navy-950 min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter uppercase mb-4">
            Terms <span className="text-accent-red">&</span> Conditions.
          </h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
            Versi 2.0 — Efektif Per: 6 April 2026
          </p>
        </div>

        <div className="space-y-20">
          {/* SECTION 1 */}
          <section>
            <div className="flex gap-6 mb-8">
              <div className="text-2xl font-black text-accent-red/20 leading-none">
                01
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                Selamat Datang di Nadi
              </h2>
            </div>
            <div className="pl-12 space-y-6 text-white/60 leading-relaxed font-medium">
              <p>
                <span className="text-white font-bold">1.1.</span> Syarat dan
                Ketentuan ini mengatur penggunaan situs web, aplikasi mobile,
                dan fitur Nadi Assess (pengecekan gejala berbasis AI).
              </p>
              <p>
                <span className="text-white font-bold">1.2.</span> Nadi
                dioperasikan oleh{" "}
                <span className="text-white">[Nama Perusahaan Anda]</span>, yang
                menyediakan akses ke produk kesehatan digital gratis termasuk
                pemeriksaan gejala (symptom checker), pelacakan kesehatan, dan
                basis data medis (Nadi-Pedia) yang ditenagai oleh sistem
                kecerdasan buatan unik kami.
              </p>
              <div className="bg-accent-red/10 border-l-4 border-accent-red p-6 rounded-r-2xl space-y-4">
                <p>
                  <span className="text-white font-black uppercase tracking-widest text-xs block mb-2">
                    1.3. PENTING:
                  </span>
                  <span className="text-white/80 font-bold">
                    Nadi Assess menggunakan teknologi penalaran probabilistik
                    pada basis pengetahuan yang dikurasi oleh ahli medis. Nadi
                    Assess TIDAK MEMBUAT DIAGNOSIS MEDIS. Informasi yang
                    diberikan hanya untuk tujuan informasi.
                  </span>
                </p>
                <p>
                  <span className="text-white font-black uppercase tracking-widest text-xs block mb-2 text-accent-red">
                    1.4. KEADAAN DARURAT:
                  </span>
                  <span className="text-white/80 font-bold underline decoration-accent-red/40 decoration-2 underline-offset-4">
                    Jika Anda berada dalam situasi darurat, segera hubungi
                    layanan darurat medis (misal: 112 atau 119) atau menuju
                    rumah sakit terdekat. Jangan mengabaikan saran dokter
                    profesional karena informasi yang Anda baca di Nadi.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2 */}
          <section>
            <div className="flex gap-6 mb-8">
              <div className="text-2xl font-black text-accent-red/20 leading-none">
                02
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                Batasan Usia & Akun Pengguna
              </h2>
            </div>
            <div className="pl-12 space-y-6 text-white/60 leading-relaxed font-medium">
              <p>
                <span className="text-white font-bold">2.1.</span> Anda harus
                berusia minimal 13 tahun untuk menggunakan layanan ini. Jika
                Anda berusia di bawah 18 tahun, penggunaan layanan memerlukan
                izin dari orang tua atau wali sah.
              </p>
              <p>
                <span className="text-white font-bold">2.2.</span> Anda
                bertanggung jawab penuh atas kerahasiaan informasi login dan
                seluruh aktivitas di Akun Pengguna Anda. Gunakan kata sandi yang
                kuat (kombinasi huruf besar/kecil, angka, dan simbol).
              </p>
            </div>
          </section>

          {/* SECTION 3 */}
          <section>
            <div className="flex gap-6 mb-8">
              <div className="text-2xl font-black text-accent-red/20 leading-none">
                03
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                Hak Penggunaan & Kekayaan Intelektual
              </h2>
            </div>
            <div className="pl-12 space-y-6 text-white/60 leading-relaxed font-medium">
              <p>
                <span className="text-white font-bold">3.1.</span> Kami
                memberikan hak terbatas, non-eksklusif, dan dapat dibatalkan
                kepada Anda untuk menggunakan Nadi untuk keperluan pribadi.
              </p>
              <div className="space-y-4">
                <p className="text-white font-bold">
                  3.2. Anda dilarang keras untuk:
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-4 items-start">
                    <div className="text-accent-red font-black text-xs pt-1.5">
                      ✕
                    </div>
                    <p>
                      Mereplikasi, menyalin, atau memodifikasi bagian mana pun
                      dari platform Nadi.
                    </p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="text-accent-red font-black text-xs pt-1.5">
                      ✕
                    </div>
                    <p>
                      Mencoba mengakses source code (melakukan reverse
                      engineering) kecuali diizinkan oleh hukum.
                    </p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="text-accent-red font-black text-xs pt-1.5">
                      ✕
                    </div>
                    <p>Menjual atau memindahkan akun Anda kepada pihak lain.</p>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 4 */}
          <section>
            <div className="flex gap-6 mb-8">
              <div className="text-2xl font-black text-accent-red/20 leading-none">
                04
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                Batasan Tanggung Jawab & Jaminan
              </h2>
            </div>
            <div className="pl-12 space-y-6 text-white/60 leading-relaxed font-medium">
              <p>
                <span className="text-white font-bold">4.1.</span> Layanan
                disediakan "Sebagaimana Adanya" (As Is) tanpa jaminan akurasi,
                keandalan, atau ketersediaan tanpa gangguan.
              </p>
              <p>
                <span className="text-white font-bold">4.2.</span> Nadi Parties
                tidak bertanggung jawab atas kerugian langsung atau tidak
                langsung yang timbul dari penggunaan atau ketidakmampuan Anda
                menggunakan platform ini. Penggunaan Nadi adalah risiko Anda
                sendiri.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-white/20 text-xs font-black uppercase tracking-widest">
            Nadi © 2026
          </p>
          <Link to="/#contact">
            <button className="bg-white text-black hover:bg-white/90 px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-none transform -skew-x-12 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
              Hubungi Kami
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
