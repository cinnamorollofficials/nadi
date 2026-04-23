# Panduan Keamanan Server: Pencegahan Path Traversal & DDoS Scanner

Dokumen ini berisi panduan teknis langkah demi langkah untuk melakukan hardening pada server _production_ (berbasis Linux/Ubuntu) melalui mekanisme blokir IP otomatis di tingkat infrastruktur. Solusi ini menggunakan kombinasi **NGINX** dan **Fail2Ban** untuk mengamankan backend dari injeksi direktori (_Path Traversal_) yang repetitif.

## Mengapa di Level Server?

Menghentikan lalu-lintas _malicious_ pada tingkat OS (via iptables/Fail2Ban) memastikan _request_ palsu dibuang sebelum menyentuh NGINX atau aplikasi Golang. Ini melindungi CPU dan memori dari serangan massal (_DDoS exhaust_), serta memberikan perlindungan dari pemindaian kerentanan (_automated vulnerability scanners_).

---

## Spesifikasi Proteksi

- **Pola Penyerangan**: Memindai kemunculan _payload_ path traversal (`../`, `..\`, `%2e%2e/`, `etc/passwd`, dsb) di URL.
- **Kondisi Validasi**: Hit tersebut harus gagal menghasilkan respons normal (tercatat sebagai _404 Not Found_ atau _400 Bad Request_ pada log NGINX).
- **Ambang Batas (_Threshold_)**: 5 kali percobaan yang terdeteksi dalam waktu 1 jam.
- **Tindakan**: Pemblokiran total IP _Attacker_ selama 24 jam.

---

## Langkah-langkah Konfigurasi

### 1. Instalasi Fail2Ban

Buka terminal server produksi Anda dan install _fail2ban_:

```bash
sudo apt update
sudo apt install fail2ban -y
```

> **Catatan**: Fail2Ban akan otomatis membaca konfigurasi iptables secara default.

---

### 2. Konfigurasi Filter Custom

Kita perlu membuat aturan _regular expression_ spesifik yang dapat mengekstrak `access.log` NGINX dan mendeteksi anomali _path traversal_.

Buat file baru di `/etc/fail2ban/filter.d/nginx-path-traversal.conf`:

```bash
sudo nano /etc/fail2ban/filter.d/nginx-path-traversal.conf
```

Tempelkan kode profil filter berikut:

```ini
# Fail2Ban filter configuration for Path Traversal Attempts
# /etc/fail2ban/filter.d/nginx-path-traversal.conf

[Definition]
# Mencekal NGINX access logs jika URL mengandung signature LFI / Path Traversal:
# 1. Traversal Directories: ../ , ..\ , %2e%2e , %252e%252e (termasuk single/double url-encode)
# 2. File Sensitif: /etc/passwd , /etc/shadow , boot.ini , .env
# 3. Eksekusi Byte Nol: %00
#
# Hanya men-trigger jika status balikan dari Web Server adalah (404 Not Found) atau (400 Bad Request)
#
# Log format example matched:
# <HOST> - - [DateTime] "GET /api/v1/../../../etc/passwd HTTP/1.1" 404 ...
failregex = ^<HOST> -.*"(GET|POST|HEAD|PUT|DELETE|OPTIONS).*(\.\./|\.\.\\|%%2e%%2e|%%252e%%252e|etc/passwd|etc/shadow|boot\.ini|\.env|%%00).*".*(404|400) .*$

ignoreregex =
```

---

### 3. Konfigurasi Jail (Kebijakan Hukuman)

Setelah profil penyaring dibuat, kita konfigurasikan hukumannya dalam hitungan detik. Aturan ini mendikte di mana log yang akan dibaca, dan limit toleransinya.

Buat file baru di `/etc/fail2ban/jail.d/nginx-path-traversal.conf`:

```bash
sudo nano /etc/fail2ban/jail.d/nginx-path-traversal.conf
```

Tempelkan pedoman jail berikut:

```ini
# Fail2Ban jail configuration for Path Traversal
# /etc/fail2ban/jail.d/nginx-path-traversal.conf

[nginx-path-traversal]
enabled  = true
port     = http,https
filter   = nginx-path-traversal

# Ubah logpath jika lokasi log NGINX Anda berbeda, misalnya /var/log/nginx/api.access.log
logpath  = /var/log/nginx/access.log

# Ban setelah 5 attempt
maxretry = 5

# Dalam rentang pengawasan 1 jam (3600s)
findtime = 3600

# Durasi pemblokiran 24 jam (86400s)
bantime  = 86400
```

---

### 4. Aktivasi dan Monitoring

Bila file di Langkah 2 dan Langkah 3 sudah disimpan, restart daemon fail2ban:

```bash
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
```

**Verifikasi Status Instalasi**:
Untuk memverifikasi bahwa jail keamanan aktif dan memantau status IP yang di-_banned_:

```bash
sudo fail2ban-client status nginx-path-traversal
```

### 5. Manajemen Pencabutan Blokir (Unban IP)
Jika kebetulan ada IP klien, teman, atau IP QA Testing Anda yang tidak sengaja terkena blokir karena melakukan pengetesan yang berujung salah, Anda bisa mencabut blokirnya (Unban) dan mengizinkan koneksi itu masuk kembali.

**Untuk mencabut satu IP tertentu:**
```bash
sudo fail2ban-client set nginx-path-traversal unbanip [IP_ADDRESS]
```
*(Contoh: `sudo fail2ban-client set nginx-path-traversal unbanip 192.168.1.5`)*

**Untuk mencabut / me-reset SEMUA IP yang terblokir:**
```bash
sudo fail2ban-client unban --all
```

---

## Cek & Simulasi Uji Coba

Untuk memastikan konfigurasi firewall ini berfungsi penuh, Anda/QA dapat melakukan simulasi berikut dari _server/mesin di luar IP server utama Anda_ (bantuan skrip pengujian atau tools perayap).

**Command Simulasi (`curl` dari mesin tester):**

```bash
# Lakukan spamming 5x ke path yang illegal
for i in {1..5}; do curl -i -X GET http://[IP_PRODUKSI]/api/v1/../../../etc/passwd; done
```

**Ekspektasi Output:**

- Request ke-1 s.d ke-5 = Server merespons `404 Not Found` atau `400 Bad Request` dari NGINX.
- Request ke-6, dan request apapun ke server tujuan dari koneksi IP Anda = **Connection Timeout / Refused** secara instan (Di-_drop_ permanen oleh sistem).
- IP tester akan terlihat pada keluaran status `sudo fail2ban-client status nginx-path-traversal` di lingkungan Server Produksi.

---

### Solusi Wajib Jika Menggunakan Cloudflare

Jika domain Anda menggunakan **Cloudflare** (misalnya `nadi.shinee.web.id`), maka *default* pencatatan log NGINX akan menampilkan IP milik server Cloudflare (contoh: `162.158.163.127`), **bukan IP asli pengunjung**. Ini bisa berakibat *error block* pada jaringan Cloudflare alih-alih sang _hacker_.

**Cara mengembalikannya agar NGINX mencatat IP Asli:**
Buka konfigurasi server NGINX Anda (biasanya di `/etc/nginx/nginx.conf` atau `/etc/nginx/sites-available/default`), lalu tempatkan skrip pendek ini di dalam blok `server { ... }` atau di blok `http { ... }`:

```nginx
# Daftarkan server milik CloudFlare
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;

# Perintahkan NGINX menangkap IP header asli pengunjung
real_ip_header CF-Connecting-IP;
```

Setelah ditambahkan, jalankan `sudo systemctl restart nginx` di server Anda. Dengan begitu, NGINX dan Fail2Ban akan berkoordinasi secara sempurna mendeteksi IP Asli mesin pelakunya!

---

_Reference Setup Document: Prevented for Nadi Deployment._ 🛡️
