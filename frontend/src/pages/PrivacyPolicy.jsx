import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="bg-navy-950 min-h-screen pt-24 pb-32">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="mb-16">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-white/50">
                         Kebijakan Privasi Nadi
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter uppercase mb-4">
                        Privacy <span className="text-accent-red">Policy</span>.
                    </h1>
                    <div className="flex flex-col gap-4">
                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                            Terakhir Diperbarui: 6 April 2026
                        </p>
                        <p className="text-white/60 text-sm font-medium leading-relaxed border-l-2 border-accent-red pl-4">
                            Harap baca kebijakan ini dengan saksama sebelum menggunakan layanan Nadi. Anda harus berusia minimal 16 tahun untuk menggunakan layanan kami (atau 13-18 tahun dengan izin wali sesuai Syarat & Ketentuan kami).
                        </p>
                    </div>
                </div>

                <div className="space-y-24">
                    {/* SECTION 1 */}
                    <section>
                        <div className="flex gap-6 mb-8">
                            <div className="text-2xl font-black text-accent-red/20 leading-none">01</div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Tentang Kebijakan Ini</h2>
                        </div>
                        <div className="pl-12 space-y-6 text-white/60 leading-relaxed font-medium text-sm md:text-base">
                            <p>
                                Kebijakan Privasi ini menjelaskan bagaimana Nadi ("kami", "kita") mengumpulkan, memproses, menyimpan, dan membagikan data pribadi Anda saat Anda menggunakan aplikasi Nadi, fitur Nadi Assess (Symptom Checker), atau situs web kami.
                            </p>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <p className="">
                                    Nadi menyediakan penilaian gejala berbasis teknologi penalaran probabilistik AI. Anda tidak wajib memberikan informasi pribadi, namun sebagian besar fungsi kami memerlukan data kesehatan untuk memberikan hasil yang akurat.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 2 */}
                    <section>
                        <div className="flex gap-6 mb-8">
                            <div className="text-2xl font-black text-accent-red/20 leading-none">02</div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Siapa Kami (Pengendali Data)</h2>
                        </div>
                        <div className="pl-12 space-y-6 text-white/60 leading-relaxed font-medium">
                            <p>Pengendali data untuk informasi Anda adalah:</p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <strong className="text-white block uppercase tracking-widest text-[10px] mb-2">Entitas</strong>
                                    <p className="text-white font-bold">[Nama Perusahaan Anda]</p>
                                    <p className="text-xs mt-1">[Alamat Kantor, Jakarta, Indonesia]</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <strong className="text-white block uppercase tracking-widest text-[10px] mb-2">Kontak Resmi</strong>
                                    <p className="text-white font-bold">support@nadi.id</p>
                                    <p className="text-xs mt-1"><span className="opacity-50">DPO:</span> dpo@nadi.id</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3 */}
                    <section>
                        <div className="flex gap-6 mb-8">
                            <div className="text-2xl font-black text-accent-red/20 leading-none">03</div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Data yang Kami Kumpulkan dan Mengapa</h2>
                        </div>
                        <div className="pl-12 space-y-12 text-white/60 leading-relaxed font-medium">
                            {/* 3.1 */}
                            <div className="space-y-4">
                                <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-3">
                                    <span className="w-6 h-px bg-accent-red"></span> 3.1. Saat Mengakses Layanan (Data Teknis)
                                </h4>
                                <p><strong className="text-white">Jenis Data:</strong> Alamat IP, tanggal/waktu akses, informasi perangkat (model, OS), dan URL file yang diminta.</p>
                                <p><strong className="text-white">Tujuan:</strong> Menjamin koneksi internet yang lancar, keamanan sistem, dan stabilitas aplikasi (mencegah serangan DDoS).</p>
                                <p className="text-accent-red/80 text-xs font-bold uppercase tracking-widest">Penyimpanan: Data teknis dihapus setelah 15 hari, kecuali terjadi insiden keamanan.</p>
                            </div>

                            {/* 3.2 */}
                            <div className="space-y-4">
                                <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-3">
                                    <span className="w-6 h-px bg-accent-red"></span> 3.2. Pendaftaran Akun dan Profil Kesehatan
                                </h4>
                                <p><strong className="text-white">Jenis Data:</strong> Email, kata sandi, nama profil, jenis kelamin biologis, tanggal lahir, dan faktor risiko umum (merokok, tekanan darah tinggi, diabetes, kehamilan).</p>
                                <p><strong className="text-white">Tujuan:</strong> Membuat akun dan menyediakan analisis dasar. Tanpa data non-opsional ini, aplikasi tidak dapat berfungsi.</p>
                                <p className="text-xs bg-white/5 inline-block px-3 py-1 rounded-md">Dasar Hukum: Pelaksanaan kontrak dan persetujuan eksplisit untuk data kesehatan.</p>
                            </div>

                            {/* 3.3 */}
                            <div className="space-y-4">
                                <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-3">
                                    <span className="w-6 h-px bg-accent-red"></span> 3.3. Penilaian Gejala (Nadi Assess)
                                </h4>
                                <p><strong className="text-white">Jenis Data:</strong> Gejala penyakit, durasi, lokasi geografis, dan riwayat medis relevan.</p>
                                <p><strong className="text-white">Tujuan:</strong> AI kami memproses data ini untuk mengidentifikasi kemungkinan penyebab gejala dan menyarankan langkah selanjutnya (misal: "temui dokter").</p>
                                <div className="p-4 border border-white/10 rounded-xl bg-accent-red/5">
                                    <strong className="text-white text-[10px] block mb-1 uppercase tracking-widest">Keputusan Otomatis:</strong>
                                    <p className="text-sm">Laporan Anda adalah hasil pemrosesan otomatis (AI), namun hanya bersifat informatif. Keputusan medis tetap berada di tangan tenaga medis profesional.</p>
                                </div>
                            </div>
                            
                            {/* 3.4 */}
                            <div className="space-y-4">
                                <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-3">
                                    <span className="w-6 h-px bg-accent-red"></span> 3.4. Nadi-Pedia (Kamus Medis)
                                </h4>
                                <p><strong className="text-white">Jenis Data:</strong> Riwayat pencarian kondisi medis.</p>
                                <p><strong className="text-white">Tujuan:</strong> Memberikan konten edukasi yang relevan dan meningkatkan pengalaman pengguna dalam mempelajari kondisi kesehatan.</p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 4 */}
                    <section>
                        <div className="flex gap-6 mb-8">
                            <div className="text-2xl font-black text-accent-red/20 leading-none">04</div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Keamanan dan Penyimpanan Data</h2>
                        </div>
                        <div className="pl-12 space-y-8 text-white/60 leading-relaxed font-medium">
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-white font-bold uppercase tracking-widest text-[10px]">Lokasi Server</h4>
                                    <p>Data Anda disimpan di server terenkripsi (misal: AWS/Google Cloud wilayah Jakarta/Singapura). Data kesehatan sensitif akan selalu diprioritaskan untuk tetap berada di wilayah yurisdiksi perlindungan data yang kuat.</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-white font-bold uppercase tracking-widest text-[10px]">Standar Enkripsi</h4>
                                    <p>Kami menggunakan Transport Layer Security (TLS) untuk mengenkripsi data saat transit antara perangkat Anda dan server kami.</p>
                                </div>
                            </div>
                            <div className="bg-accent-red/10 border-l-4 border-accent-red p-6 rounded-r-2xl">
                                <p className="text-white font-black underline uppercase tracking-widest text-[10px] mb-2 shadow-glow-red">Keamanan Email Warning:</p>
                                <p className="text-sm">Jika Anda memilih untuk menerima laporan hasil analisis melalui email, harap disadari bahwa email biasa tidak memiliki enkripsi end-to-end. Kami akan meminta persetujuan eksplisit Anda sebelum mengirimkan data sensitif via email.</p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 5 */}
                    <section>
                        <div className="flex gap-6 mb-8">
                            <div className="text-2xl font-black text-accent-red/20 leading-none">05</div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Berbagi Data dengan Pihak Ketiga</h2>
                        </div>
                        <div className="pl-12 space-y-6 text-white/60 leading-relaxed font-medium">
                            <p className="text-white font-bold border-b border-white/5 pb-4">Nadi tidak akan menjual data kesehatan pribadi Anda kepada pihak ketiga untuk kepentingan komersial mereka.</p>
                            <p>Kami hanya membagikan data jika:</p>
                            <ul className="space-y-4">
                                <li className="flex gap-4 items-start">
                                    <div className="text-accent-red font-black text-xs pt-1.5">◆</div>
                                    <div><strong className="text-white">Penyedia Layanan:</strong> Kami menggunakan penyedia teknis (misal: analitik anonim, infrastruktur cloud) yang terikat kontrak perlindungan data (DPA).</div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="text-accent-red font-black text-xs pt-1.5">◆</div>
                                    <div><strong className="text-white">Kepatuhan Hukum:</strong> Jika diwajibkan oleh perintah pengadilan atau otoritas penegak hukum untuk mencegah bahaya serius.</div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="text-accent-red font-black text-xs pt-1.5">◆</div>
                                    <div><strong className="text-white">Data Anonim:</strong> Kami dapat membagikan statistik agregat yang telah di-anonimkan secara permanen (sehingga individu tidak dapat diidentifikasi) kepada mitra riset untuk kemajuan ilmu kesehatan publik.</div>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* SECTION 6 */}
                    <section>
                        <div className="flex gap-6 mb-8">
                            <div className="text-2xl font-black text-accent-red/20 leading-none">06</div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Hak-Hak Anda (UU PDP & GDPR)</h2>
                        </div>
                        <div className="pl-12 space-y-8 text-white/60 leading-relaxed font-medium">
                            <p>Anda memiliki hak penuh atas data Anda, termasuk:</p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-accent-red/30 transition-all">
                                    <strong className="text-white block mb-2 uppercase tracking-widest text-[10px]">Hak Akses & Koreksi</strong>
                                    <p className="text-xs">Mendapatkan salinan data pribadi Anda dan memperbaiki data yang tidak akurat.</p>
                                </div>
                                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-accent-red/30 transition-all">
                                    <strong className="text-white block mb-2 uppercase tracking-widest text-[10px]">Right to be Forgotten</strong>
                                    <p className="text-xs">Menghapus akun dan data terkait dalam waktu 30 hari permintaan.</p>
                                </div>
                            </div>
                            <p className="text-xs opacity-60">
                                Catatan: Penarikan persetujuan dapat dilakukan kapan saja melalui pengaturan aplikasi. Data yang telah di-anonimkan sebelumnya mungkin tidak dapat dihapus jika telah digunakan untuk pengembangan model AI kolektif.
                            </p>
                        </div>
                    </section>

                    {/* SECTION 7 */}
                    <section>
                        <div className="flex gap-6 mb-8">
                            <div className="text-2xl font-black text-accent-red/20 leading-none">07</div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Retensi Data</h2>
                        </div>
                        <div className="pl-12 space-y-6 text-white/60 leading-relaxed font-medium">
                            <p>
                                Kami menyimpan data pribadi Anda selama akun Anda aktif. Jika akun dihapus, kami tetap menyimpan data tertentu (dalam bentuk terenkripsi dan terbatas aksesnya) selama hingga <strong className="text-white">7 tahun</strong> untuk tujuan pembelaan klaim hukum atau kewajiban keselamatan perangkat medis (Post-Market Surveillance).
                            </p>
                        </div>
                    </section>

                    {/* SECTION 8 */}
                    <section>
                        <div className="flex gap-6 mb-8">
                            <div className="text-2xl font-black text-accent-red/20 leading-none">08</div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Perubahan Kebijakan</h2>
                        </div>
                        <div className="pl-12 space-y-6 text-white/60 leading-relaxed font-medium">
                            <p>
                                Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi aplikasi setidaknya 30 hari sebelum berlaku.
                            </p>
                        </div>
                    </section>
                </div>

                <div className="mt-24 pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-white/20 text-xs font-black uppercase tracking-widest">Nadi Data Protection Compliance</p>
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

export default PrivacyPolicy;
