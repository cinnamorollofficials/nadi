import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-3xl">

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-zinc-200 dark:border-slate-800 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
            Dokumen Hukum Resmi — Nadi
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Kebijakan Privasi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Versi 2.0 &nbsp;|&nbsp; Berlaku sejak: 6 April 2026 &nbsp;|&nbsp; Terakhir diperbarui: 6 April 2026
          </p>
        </div>

        {/* Preamble */}
        <div className="mb-10 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
          <p>
            Kebijakan Privasi ini menjelaskan bagaimana Nadi mengumpulkan, memproses, menyimpan, melindungi, dan mengungkapkan data pribadi Anda sesuai dengan Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi, Peraturan Menteri Komunikasi dan Informatika Nomor 20 Tahun 2016, dan Peraturan Pemerintah Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik.
          </p>
          <p>
            Dengan menggunakan layanan Nadi, Anda menyatakan telah membaca, memahami, dan menyetujui Kebijakan Privasi ini. Harap baca dokumen ini dengan saksama. Anda harus berusia paling sedikit 18 (delapan belas) tahun, atau 13 (tiga belas) hingga 17 (tujuh belas) tahun dengan persetujuan orang tua atau wali yang sah, untuk menggunakan layanan kami.
          </p>
        </div>

        {/* Body */}
        <div className="space-y-10 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 1 — Identitas Pengendali Data Pribadi
            </h2>
            <div className="space-y-3">
              <p>
                Sesuai dengan Pasal 1 angka 4 Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi, Nadi bertindak sebagai <span className="font-semibold text-slate-900 dark:text-white">Pengendali Data Pribadi</span> atas data yang dikumpulkan melalui Platform. Identitas Pengendali adalah sebagai berikut:
              </p>
              <table className="w-full text-xs border-collapse mt-2">
                <tbody>
                  {[
                    ["Nama Entitas", "[Nama PT/CV Pengelola Nadi]"],
                    ["Domisili Hukum", "Jakarta, Indonesia"],
                    ["Nomor Registrasi PSE", "[Nomor Registrasi Kominfo]"],
                    ["Nomor Induk Berusaha", "[NIB]"],
                    ["Alamat Surat Elektronik Resmi", "legal@nadi.id"],
                    ["Petugas Perlindungan Data (DPO)", "dpo@nadi.id"],
                  ].map(([label, val]) => (
                    <tr key={label} className="border-b border-zinc-100 dark:border-slate-800">
                      <td className="py-2 pr-4 font-semibold text-slate-600 dark:text-slate-400 w-1/2 align-top">{label}</td>
                      <td className="py-2 text-slate-800 dark:text-slate-200">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 2 — Dasar Hukum Pemrosesan Data
            </h2>
            <div className="space-y-3">
              <p>
                Berdasarkan Pasal 20 Undang-Undang Nomor 27 Tahun 2022, Nadi memproses data pribadi Anda berdasarkan satu atau lebih dasar hukum berikut:
              </p>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li><span className="font-semibold text-slate-900 dark:text-white">Persetujuan (Consent).</span> Anda memberikan persetujuan eksplisit sebelum kami memproses data pribadi, khususnya data kesehatan yang bersifat sensitif, sebagaimana dimaksud dalam Pasal 21 Undang-Undang Nomor 27 Tahun 2022.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Pelaksanaan Perjanjian.</span> Pemrosesan data diperlukan untuk menyediakan layanan yang Anda minta dan memenuhi kewajiban kontraktual kami kepada Anda.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Kewajiban Hukum.</span> Pemrosesan data untuk memenuhi kewajiban yang diatur oleh peraturan perundang-undangan, termasuk kewajiban pelaporan kepada otoritas yang berwenang.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Kepentingan yang Sah (Legitimate Interest).</span> Pemrosesan data untuk kepentingan keamanan sistem, pencegahan penipuan, dan peningkatan kualitas layanan, sepanjang tidak merugikan hak-hak Pengguna secara tidak proporsional.</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 3 — Kategori Data Pribadi yang Dikumpulkan
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white mb-2">3.1. Data Identitas dan Akun</p>
                <ol className="list-decimal list-outside ml-5 space-y-1">
                  {["Nama lengkap dan nama profil.", "Alamat surat elektronik aktif.", "Kata sandi yang disimpan dalam bentuk enkripsi hash.", "Nomor telepon (bersifat opsional).", "Tanggal lahir dan jenis kelamin biologis."].map((i, idx) => <li key={idx}>{i}</li>)}
                </ol>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white mb-2">3.2. Data Kesehatan</p>
                <p className="mb-2">Data kesehatan merupakan Data Pribadi yang Bersifat Spesifik sebagaimana diatur dalam Pasal 4 ayat (2) Undang-Undang Nomor 27 Tahun 2022 dan mendapat tingkat perlindungan lebih tinggi. Data ini hanya diproses berdasarkan persetujuan eksplisit Anda, meliputi:</p>
                <ol className="list-decimal list-outside ml-5 space-y-1">
                  {["Gejala dan keluhan yang diinputkan pada fitur Nadi Assess.", "Riwayat penyakit dan kondisi medis yang Anda deklarasikan secara mandiri.", "Faktor risiko kesehatan (kebiasaan merokok, hipertensi, diabetes, kehamilan, dan lain-lain).", "Riwayat sesi konsultasi dan hasil analisis yang dihasilkan oleh sistem.", "Riwayat pencarian pada basis data Medicpedia."].map((i, idx) => <li key={idx}>{i}</li>)}
                </ol>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white mb-2">3.3. Data Teknis dan Data Penggunaan</p>
                <ol className="list-decimal list-outside ml-5 space-y-1">
                  {["Alamat protokol internet (IP), tipe peramban, dan sistem operasi perangkat.", "Data catatan akses: halaman yang dikunjungi, tanggal dan waktu akses, durasi sesi.", "Data lokasi kota atau wilayah berdasarkan alamat IP (bukan data geo-lokasi presisi).", "Preferensi dan pengaturan yang disimpan di dalam aplikasi.", "Token sesi dan kuki (cookie) yang diperlukan untuk fungsionalitas Platform."].map((i, idx) => <li key={idx}>{i}</li>)}
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 4 — Tujuan Pemrosesan Data
            </h2>
            <div className="space-y-3">
              <p>Data pribadi Anda digunakan untuk tujuan-tujuan berikut:</p>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>Pembuatan, verifikasi, dan pengelolaan akun Pengguna;</li>
                <li>Penyediaan fitur Nadi Assess berdasarkan profil dan gejala yang Anda berikan;</li>
                <li>Personalisasi konten Medicpedia berdasarkan riwayat penggunaan;</li>
                <li>Pengiriman notifikasi layanan, pembaruan sistem, dan informasi yang relevan;</li>
                <li>Pemeliharaan keamanan sistem dan pencegahan akses tidak sah atau penipuan;</li>
                <li>Peningkatan kualitas layanan melalui analisis data penggunaan yang telah dianonimkan;</li>
                <li>Pemenuhan kewajiban hukum dan kepatuhan terhadap regulasi yang berlaku; dan</li>
                <li>Penanganan pertanyaan, pengaduan, dan permintaan dukungan Pengguna.</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 5 — Keamanan dan Perlindungan Data
            </h2>
            <div className="space-y-3">
              <p>5.1. Kami menerapkan langkah-langkah teknis dan organisasi yang sesuai dengan standar industri untuk melindungi data Anda dari akses tidak sah, pengungkapan, perubahan, atau penghapusan yang tidak sah, meliputi: (i) enkripsi data dalam transit menggunakan Transport Layer Security (TLS) versi 1.2 atau lebih tinggi; (ii) enkripsi penyimpanan data sensitif menggunakan algoritma AES-256; (iii) penyimpanan kata sandi menggunakan algoritma hashing bcrypt; (iv) kontrol akses berbasis prinsip hak istimewa minimal; dan (v) pencatatan seluruh akses internal dalam log audit.</p>
              <p>5.2. Platform menjalani pengujian keamanan berkala dalam bentuk uji penetrasi dan penilaian kerentanan oleh pihak independen.</p>
              <p>5.3. Dalam hal terjadi pelanggaran keamanan data yang berdampak signifikan terhadap data pribadi Anda, kami akan memberitahu Anda dan Komisi Perlindungan Data Pribadi dalam waktu paling lama <span className="font-semibold text-slate-900 dark:text-white">14 (empat belas) hari kerja</span> sejak pelanggaran diketahui, sesuai dengan ketentuan Pasal 46 Undang-Undang Nomor 27 Tahun 2022.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 6 — Pengungkapan Data kepada Pihak Ketiga
            </h2>
            <div className="space-y-3">
              <p>
                Nadi tidak menjual, menyewakan, atau memperdagangkan data pribadi Anda kepada pihak ketiga untuk kepentingan komersial mereka. Pengungkapan data hanya dapat dilakukan dalam kondisi berikut:
              </p>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li><span className="font-semibold text-slate-900 dark:text-white">Penyedia Layanan Teknis.</span> Kami bekerja sama dengan penyedia infrastruktur cloud, analitik, dan layanan keamanan yang terikat oleh Perjanjian Pemrosesan Data (Data Processing Agreement) dan hanya memproses data atas instruksi kami.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Kewajiban Hukum.</span> Apabila diharuskan oleh perintah pengadilan, lembaga penegak hukum, atau otoritas regulasi yang berwenang di Indonesia berdasarkan ketentuan hukum yang berlaku.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Perlindungan Kepentingan Vital.</span> Apabila pengungkapan diperlukan untuk mencegah ancaman nyata terhadap keselamatan jiwa seseorang.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Transaksi Korporasi.</span> Dalam hal terjadi merger, akuisisi, atau restrukturisasi usaha, data Pengguna dapat dialihkan kepada entitas pengambil alih dengan kewajiban privasi yang setara. Pengguna akan diberitahu sebelum pengalihan dilakukan.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Data Agregat dan Anonim.</span> Statistik penggunaan yang telah dianonimkan secara permanen dapat dibagikan kepada mitra riset kesehatan publik, dengan syarat individu tidak dapat diidentifikasi dari data tersebut.</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 7 — Penyimpanan dan Retensi Data
            </h2>
            <div className="space-y-3">
              <p>7.1. Data Anda disimpan di server yang berlokasi di wilayah Indonesia atau yurisdiksi dengan standar perlindungan data yang setara dengan ketentuan hukum Indonesia.</p>
              <p>7.2. Kami menerapkan periode retensi sebagaimana tercantum dalam tabel berikut:</p>
              <table className="w-full text-xs border-collapse mt-2">
                <thead>
                  <tr className="border-b-2 border-zinc-300 dark:border-slate-700">
                    <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Kategori Data</th>
                    <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Periode Retensi</th>
                    <th className="text-left py-2 font-semibold text-slate-700 dark:text-slate-300">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Data akun aktif", "Selama akun aktif", "Dihapus 30 hari setelah penutupan akun"],
                    ["Riwayat konsultasi", "Selama akun aktif", "Dapat dihapus Pengguna kapan saja"],
                    ["Data catatan teknis (log)", "15 hari", "Kecuali diperlukan untuk investigasi keamanan"],
                    ["Data transaksi dan tagihan", "5 tahun", "Sesuai kewajiban perpajakan (UU No. 28 Tahun 2007)"],
                    ["Data cadangan (backup)", "Maks. 90 hari", "Kemudian dihapus secara permanen"],
                    ["Data pasca penutupan akun", "Maks. 7 tahun", "Bentuk terenkripsi untuk keperluan kewajiban hukum"],
                  ].map(([kategori, periode, ket], i) => (
                    <tr key={i} className="border-b border-zinc-100 dark:border-slate-800">
                      <td className="py-2 pr-4 align-top">{kategori}</td>
                      <td className="py-2 pr-4 font-semibold text-slate-900 dark:text-white align-top">{periode}</td>
                      <td className="py-2 text-slate-500 dark:text-slate-400 align-top">{ket}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 8 — Hak-Hak Subjek Data Pribadi
            </h2>
            <div className="space-y-3">
              <p>Sesuai dengan Pasal 5 hingga Pasal 18 Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi, Anda memiliki hak-hak berikut:</p>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li><span className="font-semibold text-slate-900 dark:text-white">Hak Mendapatkan Informasi (Pasal 8).</span> Mendapatkan informasi yang jelas dan transparan mengenai identitas Pengendali, tujuan pemrosesan, dan pihak yang menerima data.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Hak Akses (Pasal 9).</span> Memperoleh salinan data pribadi Anda yang kami simpan dan kelola.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Hak Koreksi (Pasal 10).</span> Memperbarui atau memperbaiki data pribadi yang tidak akurat, tidak lengkap, atau menyesatkan.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Hak Penghapusan (Pasal 11).</span> Meminta penghapusan data pribadi Anda dalam kondisi yang diatur oleh Undang-Undang Perlindungan Data Pribadi.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Hak Penarikan Persetujuan (Pasal 12).</span> Menarik kembali persetujuan atas pemrosesan data kapan saja, tanpa memengaruhi keabsahan pemrosesan yang telah dilakukan sebelumnya.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Hak Portabilitas Data (Pasal 13).</span> Mendapatkan data Anda dalam format yang dapat dibaca oleh mesin untuk keperluan transfer kepada Pengendali Data lain.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Hak Keberatan (Pasal 14).</span> Mengajukan keberatan atas pemrosesan data yang didasarkan pada kepentingan yang sah apabila terdapat alasan yang kuat.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Hak atas Pengambilan Keputusan Otomatis (Pasal 15).</span> Meminta peninjauan oleh tenaga manusia atas setiap keputusan yang dihasilkan semata-mata oleh sistem otomatis atau kecerdasan buatan yang berdampak signifikan.</li>
                <li><span className="font-semibold text-slate-900 dark:text-white">Hak Penundaan Pemrosesan (Pasal 16).</span> Meminta penundaan pemrosesan data pribadi Anda dalam kondisi tertentu selama permohonan koreksi atau keberatan sedang diproses.</li>
              </ol>
              <p>Untuk mengajukan permohonan terkait hak-hak Anda, silakan menghubungi Petugas Perlindungan Data kami melalui surat elektronik di <a href="mailto:dpo@nadi.id" className="underline hover:text-slate-900 dark:hover:text-white transition-colors">dpo@nadi.id</a>. Kami akan memberikan tanggapan dalam waktu paling lama <span className="font-semibold text-slate-900 dark:text-white">14 (empat belas) hari kerja</span>. Apabila Anda merasa hak-hak Anda tidak dipenuhi, Anda berhak mengajukan pengaduan kepada <span className="font-semibold text-slate-900 dark:text-white">Komisi Perlindungan Data Pribadi (KPDP)</span> sesuai ketentuan yang berlaku.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 9 — Cookie dan Teknologi Pelacakan
            </h2>
            <div className="space-y-3">
              <p>9.1. Kami menggunakan cookie dan teknologi serupa untuk memastikan fungsionalitas Platform, menganalisis penggunaan, dan meningkatkan pengalaman pengguna. Kategori cookie yang digunakan meliputi: (i) <span className="font-semibold text-slate-900 dark:text-white">Cookie Esensial</span>, yang diperlukan untuk fungsi dasar Platform seperti autentikasi sesi dan keamanan, serta tidak dapat dinonaktifkan; (ii) <span className="font-semibold text-slate-900 dark:text-white">Cookie Analitik</span>, yang digunakan untuk memahami pola penggunaan Platform secara anonim; dan (iii) <span className="font-semibold text-slate-900 dark:text-white">Cookie Preferensi</span>, yang menyimpan pengaturan tampilan dan bahasa Pengguna.</p>
              <p>9.2. Anda dapat mengelola preferensi cookie melalui pengaturan peramban. Perlu diperhatikan bahwa menonaktifkan cookie esensial dapat mengganggu fungsionalitas Platform secara keseluruhan.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 10 — Perlindungan Data Anak di Bawah Umur
            </h2>
            <div className="space-y-3">
              <p>10.1. Nadi tidak secara sengaja mengumpulkan data pribadi dari anak di bawah usia 13 (tiga belas) tahun.</p>
              <p>10.2. Apabila Anda adalah orang tua atau wali dan mengetahui bahwa anak Anda telah memberikan data pribadi tanpa persetujuan Anda, harap segera menghubungi kami melalui <a href="mailto:dpo@nadi.id" className="underline hover:text-slate-900 dark:hover:text-white transition-colors">dpo@nadi.id</a> agar kami dapat mengambil tindakan penghapusan data yang diperlukan.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 11 — Perubahan Kebijakan Privasi
            </h2>
            <div className="space-y-3">
              <p>11.1. Kami dapat mengubah Kebijakan Privasi ini dari waktu ke waktu seiring dengan perkembangan regulasi, teknologi, atau cakupan layanan kami. Perubahan yang bersifat material akan diberitahukan kepada Pengguna melalui surat elektronik ke alamat terdaftar atau pemberitahuan yang ditampilkan secara jelas di dalam Platform, minimal 14 (empat belas) hari kalender sebelum perubahan berlaku.</p>
              <p>11.2. Versi terdahulu dari Kebijakan Privasi ini dapat diminta melalui <a href="mailto:dpo@nadi.id" className="underline hover:text-slate-900 dark:hover:text-white transition-colors">dpo@nadi.id</a>.</p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-400 dark:text-slate-500 space-y-1">
              <p>Nadi &copy; 2026. Seluruh hak dilindungi undang-undang.</p>
              <p>Petugas Perlindungan Data: <a href="mailto:dpo@nadi.id" className="underline hover:text-slate-600 dark:hover:text-slate-300">dpo@nadi.id</a></p>
            </div>
            <div className="flex gap-3 text-xs">
              <Link to="/terms" className="text-slate-500 dark:text-slate-400 underline hover:text-slate-900 dark:hover:text-white transition-colors">
                Syarat &amp; Ketentuan
              </Link>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <Link to="/#contact" className="text-slate-500 dark:text-slate-400 underline hover:text-slate-900 dark:hover:text-white transition-colors">
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
