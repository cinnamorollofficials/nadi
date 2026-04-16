import { Link } from "react-router-dom";

const TermsConditions = () => {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-3xl">

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-zinc-200 dark:border-slate-800 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
            Dokumen Hukum Resmi — Nadi
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Syarat dan Ketentuan Penggunaan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Versi 2.0 &nbsp;|&nbsp; Berlaku sejak: 6 April 2026 &nbsp;|&nbsp; Terakhir diperbarui: 6 April 2026
          </p>
        </div>

        {/* Preamble */}
        <div className="mb-10 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
          <p>
            Dokumen ini merupakan perjanjian yang mengikat secara hukum antara Anda selaku Pengguna dan pengelola platform Nadi. Dengan mengakses atau menggunakan layanan Nadi dalam bentuk apa pun, Anda dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan yang tercantum dalam dokumen ini.
          </p>
          <p>
            Apabila Anda tidak menyetujui salah satu atau seluruh ketentuan di bawah ini, harap hentikan penggunaan layanan segera.
          </p>
        </div>

        {/* Body */}
        <div className="space-y-10 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 1 — Definisi dan Interpretasi
            </h2>
            <p className="mb-3">Dalam Syarat dan Ketentuan ini, istilah-istilah berikut memiliki definisi sebagai berikut:</p>
            <ol className="list-decimal list-outside ml-5 space-y-2">
              <li><span className="font-semibold text-slate-900 dark:text-white">"Nadi" atau "Platform"</span> adalah aplikasi web dan layanan digital yang dioperasikan di bawah merek Nadi, termasuk seluruh fitur, konten, dan infrastruktur pendukungnya.</li>
              <li><span className="font-semibold text-slate-900 dark:text-white">"Pengelola"</span> adalah entitas hukum yang mengoperasikan Nadi, berkedudukan di Indonesia.</li>
              <li><span className="font-semibold text-slate-900 dark:text-white">"Pengguna"</span> adalah setiap orang perseorangan yang mengakses, mendaftarkan diri, atau menggunakan layanan Nadi.</li>
              <li><span className="font-semibold text-slate-900 dark:text-white">"Akun"</span> adalah identitas digital unik yang dibuat Pengguna untuk mengakses fitur-fitur yang memerlukan autentikasi.</li>
              <li><span className="font-semibold text-slate-900 dark:text-white">"Nadi Assess"</span> adalah fitur pengecekan gejala kesehatan berbasis kecerdasan buatan yang tersedia di dalam Platform.</li>
              <li><span className="font-semibold text-slate-900 dark:text-white">"Data Pribadi"</span> adalah informasi yang secara langsung maupun tidak langsung dapat mengidentifikasi Pengguna, sebagaimana dimaksud dalam Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi.</li>
              <li><span className="font-semibold text-slate-900 dark:text-white">"Konten"</span> adalah seluruh teks, gambar, grafis, perangkat lunak, data medis, dan materi lain yang tersedia di Platform.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 2 — Dasar Hukum dan Kepatuhan Regulasi
            </h2>
            <p className="mb-3">Nadi beroperasi dalam kerangka hukum Republik Indonesia dan tunduk pada peraturan perundang-undangan yang berlaku, antara lain:</p>
            <ol className="list-decimal list-outside ml-5 space-y-2">
              <li>Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi;</li>
              <li>Undang-Undang Nomor 11 Tahun 2008 jo. Undang-Undang Nomor 19 Tahun 2016 tentang Informasi dan Transaksi Elektronik;</li>
              <li>Peraturan Pemerintah Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik;</li>
              <li>Undang-Undang Nomor 36 Tahun 2009 tentang Kesehatan sebagaimana telah diubah dengan Undang-Undang Nomor 17 Tahun 2023;</li>
              <li>Undang-Undang Nomor 29 Tahun 2004 tentang Praktik Kedokteran;</li>
              <li>Peraturan Menteri Komunikasi dan Informatika Nomor 20 Tahun 2016 tentang Perlindungan Data Pribadi dalam Sistem Elektronik;</li>
              <li>Undang-Undang Nomor 8 Tahun 1999 tentang Perlindungan Konsumen; dan</li>
              <li>Peraturan perundang-undangan lain yang berlaku di Republik Indonesia.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 3 — Ruang Lingkup Layanan
            </h2>
            <div className="space-y-3">
              <p>3.1. Nadi menyediakan layanan kesehatan digital yang meliputi: (i) platform pengecekan gejala berbasis kecerdasan buatan (Nadi Assess); (ii) basis data medis edukatif (Medicpedia); (iii) pelacakan riwayat kesehatan pribadi; dan (iv) fitur konsultasi awal serta rekomendasi tindak lanjut medis.</p>
              <p>3.2. <span className="font-semibold text-slate-900 dark:text-white">Nadi bukan merupakan fasilitas pelayanan kesehatan</span> dan tidak menggantikan konsultasi, diagnosis, atau penanganan oleh tenaga kesehatan berlisensi. Seluruh konten yang disediakan bersifat edukatif dan informatif semata, sesuai dengan ketentuan Undang-Undang Nomor 36 Tahun 2009 tentang Kesehatan dan Undang-Undang Nomor 29 Tahun 2004 tentang Praktik Kedokteran.</p>
              <p>3.3. Nadi Assess tidak memberikan diagnosis medis, resep, maupun saran medis profesional. Dalam situasi gawat darurat, Pengguna wajib segera menghubungi layanan darurat medis di nomor <span className="font-semibold text-slate-900 dark:text-white">119</span> atau menuju fasilitas kesehatan terdekat.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 4 — Syarat Pendaftaran dan Pengelolaan Akun
            </h2>
            <div className="space-y-3">
              <p>4.1. Pengguna harus berusia paling sedikit 18 (delapan belas) tahun atau telah dinyatakan dewasa menurut hukum yang berlaku. Pengguna berusia 13 (tiga belas) hingga 17 (tujuh belas) tahun hanya dapat menggunakan layanan ini dengan pendampingan dan persetujuan tertulis dari orang tua atau wali yang sah.</p>
              <p>4.2. Pengguna wajib memberikan informasi yang benar, akurat, terkini, dan lengkap pada saat pendaftaran dan selama penggunaan layanan. Penyampaian data yang tidak benar merupakan pelanggaran terhadap ketentuan ini dan dapat mengakibatkan penutupan akun.</p>
              <p>4.3. Pengguna bertanggung jawab penuh atas kerahasiaan kredensial akun dan atas seluruh aktivitas yang dilakukan melalui akunnya. Pengguna wajib segera melaporkan kepada Pengelola apabila terdapat indikasi akses tidak sah terhadap akunnya.</p>
              <p>4.4. Setiap individu hanya diperkenankan memiliki satu akun aktif. Pemindahtanganan akun kepada pihak lain dalam bentuk apa pun dilarang.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 5 — Hak dan Kewajiban Pengguna
            </h2>
            <div className="space-y-3">
              <p>5.1. Pengguna berhak memperoleh akses atas seluruh fitur layanan sesuai ketentuan yang berlaku, mendapatkan informasi yang jelas mengenai pemrosesan data pribadinya, mengajukan koreksi atau penghapusan data pribadi, serta menarik persetujuan pemrosesan data kapan saja.</p>
              <p>5.2. Pengguna dilarang keras untuk: (i) menggunakan layanan bagi tujuan yang melanggar hukum; (ii) menyebarkan konten yang mengandung kebohongan, fitnah, ujaran kebencian, atau konten yang melanggar Undang-Undang tentang Informasi dan Transaksi Elektronik; (iii) melakukan rekayasa balik terhadap perangkat lunak Platform; (iv) menyalin, mendistribusikan, atau memodifikasi konten Platform tanpa izin tertulis; (v) menggunakan skrip otomatis atau bot tanpa persetujuan tertulis; dan (vi) mengakses akun pengguna lain secara tidak sah.</p>
              <p>5.3. Pelanggaran terhadap ayat 5.2 dapat dikenai sanksi perdata maupun pidana sebagaimana diatur dalam ketentuan hukum yang berlaku di Indonesia.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 6 — Kekayaan Intelektual
            </h2>
            <div className="space-y-3">
              <p>6.1. Seluruh konten, merek dagang, logo, perangkat lunak, basis data, desain antarmuka, dan kekayaan intelektual lainnya yang terdapat pada Platform adalah milik Pengelola atau pemegang lisensinya, dan dilindungi oleh Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta serta peraturan kekayaan intelektual lainnya yang berlaku.</p>
              <p>6.2. Pengguna diberikan lisensi terbatas, non-eksklusif, tidak dapat dialihkan, dan dapat dicabut sewaktu-waktu untuk menggunakan Platform semata-mata bagi keperluan pribadi dan non-komersial.</p>
              <p>6.3. Setiap pelanggaran terhadap hak kekayaan intelektual Pengelola dapat dikenai tuntutan hukum sesuai ketentuan yang berlaku.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 7 — Penafian dan Batasan Tanggung Jawab
            </h2>
            <div className="space-y-3">
              <p>7.1. Layanan disediakan dalam kondisi "sebagaimana adanya" (<em>as is</em>) tanpa jaminan apa pun, baik tersurat maupun tersirat, mengenai akurasi, keandalan, kelengkapan, atau keberlanjutan layanan.</p>
              <p>7.2. Pengelola tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan Platform.</p>
              <p>7.3. Pengelola tidak bertanggung jawab atas tindakan medis apa pun yang diambil Pengguna berdasarkan informasi yang diperoleh dari Platform.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 8 — Penangguhan dan Penutupan Akun
            </h2>
            <div className="space-y-3">
              <p>8.1. Pengelola berhak menangguhkan atau menutup akun Pengguna tanpa pemberitahuan terlebih dahulu apabila Pengguna terbukti melanggar ketentuan dalam dokumen ini, menyalahgunakan layanan, atau berdasarkan perintah dari otoritas hukum yang berwenang.</p>
              <p>8.2. Pengguna dapat menutup akunnya kapan saja melalui pengaturan akun. Setelah penutupan akun, data pribadi akan ditangani sesuai dengan Kebijakan Privasi yang berlaku.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 9 — Hukum yang Berlaku dan Penyelesaian Sengketa
            </h2>
            <div className="space-y-3">
              <p>9.1. Syarat dan Ketentuan ini diatur oleh dan ditafsirkan berdasarkan hukum Negara Kesatuan Republik Indonesia.</p>
              <p>9.2. Setiap sengketa yang timbul dari atau sehubungan dengan Syarat dan Ketentuan ini akan diselesaikan terlebih dahulu melalui musyawarah untuk mufakat dalam jangka waktu 30 (tiga puluh) hari kalender sejak sengketa diajukan secara tertulis.</p>
              <p>9.3. Apabila musyawarah tidak menghasilkan kesepakatan, sengketa akan diselesaikan melalui Pengadilan Negeri yang berwenang di Jakarta, atau melalui Badan Arbitrase Nasional Indonesia (BANI) apabila para pihak menyepakatinya secara tertulis.</p>
              <p>9.4. Pengguna juga berhak mengajukan pengaduan kepada Badan Penyelesaian Sengketa Konsumen (BPSK) sesuai Undang-Undang Nomor 8 Tahun 1999 tentang Perlindungan Konsumen.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
              Pasal 10 — Perubahan Syarat dan Ketentuan
            </h2>
            <div className="space-y-3">
              <p>10.1. Pengelola berhak mengubah Syarat dan Ketentuan ini sewaktu-waktu. Perubahan yang bersifat material akan diberitahukan kepada Pengguna melalui surat elektronik ke alamat terdaftar atau pemberitahuan di dalam Platform, minimal 14 (empat belas) hari kalender sebelum perubahan berlaku.</p>
              <p>10.2. Penggunaan berkelanjutan atas layanan setelah tanggal efektif perubahan merupakan penerimaan Pengguna atas Syarat dan Ketentuan yang telah diperbarui.</p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-400 dark:text-slate-500 space-y-1">
              <p>Nadi &copy; 2026. Seluruh hak dilindungi undang-undang.</p>
              <p>Pertanyaan hukum: <a href="mailto:legal@nadi.id" className="underline hover:text-slate-600 dark:hover:text-slate-300">legal@nadi.id</a></p>
            </div>
            <div className="flex gap-3 text-xs">
              <Link to="/privacy" className="text-slate-500 dark:text-slate-400 underline hover:text-slate-900 dark:hover:text-white transition-colors">
                Kebijakan Privasi
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

export default TermsConditions;
