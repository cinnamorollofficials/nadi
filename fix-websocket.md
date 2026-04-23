# Troubleshooting: WebSocket "Connection Failed" di Production

Dokumen ini mencatat proses debugging dan solusi untuk masalah koneksi WebSocket yang gagal pada fitur AI Chat (Nadi) saat di-deploy ke server production. WebSocket bekerja sempurna di lokal (`make run-dev`), namun selalu berstatus `finished` / `connection failed` saat diakses melalui domain production.

---

## Gejala

- Di halaman AI Chat production (`nadi.xxxxxx`), WebSocket langsung berubah statusnya menjadi **"finished"** di tab Network browser.
- **Response Headers kosong** — browser tidak menampilkan balasan apapun dari server.
- Di tab Console, muncul error:
  ```
  WebSocket connection to 'wss://nadi-api.xxxxxx/api/v1/chat/ws?token=eyJ...' failed:
  WebSocket Error: Event {isTrusted: true, type: 'error', ...}
  Chat WebSocket Disconnected
  ```
- Semua endpoint REST API (`GET`, `POST`, dll) tetap berfungsi normal.

---

## Arsitektur Infrastruktur

```
Browser (wss://)
    ↓
Cloudflare (Proxy + SSL Termination)
    ↓
NGINX (port 80, reverse proxy)
    ↓
Golang / Gin (port 8090, Gorilla WebSocket)
```

---

## Proses Debugging

### Langkah 1: Isolasi Layer

Untuk menemukan layer yang bermasalah, dilakukan pengujian bertahap dari dalam server VPS:

**Tes A — Golang langsung (bypass NGINX & Cloudflare):**

```bash
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  "http://127.0.0.1:8090/api/v1/chat/ws?token=test"
```

**Hasil:** `401 Unauthorized` — Golang menerima dan memproses WebSocket dengan benar. ✅

**Tes B — Lewat NGINX (bypass Cloudflare):**

```bash
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  -H "Host: nadi-api.xxxxxx" \
  "http://127.0.0.1:80/api/v1/chat/ws?token=test"
```

**Hasil:** `401 Unauthorized` — NGINX meneruskan header WebSocket ke Golang dengan benar. ✅

**Kesimpulan:** Golang dan NGINX berfungsi sempurna. Masalah ada di layer **Cloudflare**.

---

### Langkah 2: Periksa Cloudflare

**Temuan 1 — IP yang tercatat bukan IP asli pengunjung:**

```
162.158.163.127 - - [24/Apr/2026:00:50:04 +0800] "GET /api/v1/users/me HTTP/1.1" 200 ...
```

IP `162.158.x.x` adalah IP milik Cloudflare, bukan IP pengunjung sebenarnya. Identitas IP asli tersembunyi di header `CF-Connecting-IP`.

**Temuan 2 — Mode SSL Cloudflare dalam keadaan "Off":**

Saat SSL mode Cloudflare diatur ke **Off**, Cloudflare tidak melakukan terminasi SSL/TLS secara penuh. Akibatnya, koneksi `wss://` (WebSocket Secure) yang dikirim oleh browser **gagal di-_handshake_** oleh Cloudflare karena negosiasi TLS tidak diproses. Koneksi langsung diputus sebelum sempat diteruskan ke NGINX.

---

## Solusi

### 1. Ubah Mode SSL Cloudflare ke "Flexible"

- Buka **Cloudflare Dashboard** → domain target → **SSL/TLS** → **Overview**
- Ubah mode dari **Off** menjadi **Flexible**

Mode **Flexible** memastikan:

- Cloudflare melakukan terminasi SSL/TLS untuk koneksi masuk dari browser (`https://` dan `wss://`)
- Cloudflare meneruskan _traffic_ ke server origin (NGINX) via **HTTP biasa (port 80)**
- Cocok dengan konfigurasi NGINX yang hanya `listen 80`

### 2. Konfigurasi NGINX untuk WebSocket

Pastikan konfigurasi NGINX memiliki blok khusus untuk endpoint WebSocket agar header `Upgrade` dan `Connection` di-hardcode (tidak bergantung pada variabel yang bisa diubah oleh Cloudflare):

```nginx
server {
    listen 80;
    server_name nadi-api.xxxxxx www.nadi-api.xxxxxx;

    # --- Cloudflare Real IP Restoration ---
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
    real_ip_header CF-Connecting-IP;
    # -----------------------------------------

    # Blok khusus WebSocket (hardcoded headers)
    location /api/v1/chat/ws {
        proxy_pass http://localhost:8090;

        proxy_http_version 1.1;
        proxy_set_header Upgrade "websocket";
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeout panjang agar koneksi WS tidak diputus NGINX
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # Blok API standar
    location / {
        proxy_pass http://localhost:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Setelah mengubah konfigurasi:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Verifikasi

Setelah kedua perubahan di atas diterapkan:

1. Refresh halaman chat di browser.
2. Buka **Inspect Element → Network** → filter `WS`.
3. Koneksi WebSocket seharusnya berstatus **101 Switching Protocols** (hijau).
4. Buka **Console** — tidak boleh ada error `WebSocket connection failed`.

---

## Pelajaran (Lessons Learned)

| #   | Insight                                                  | Detail                                                                                                                    |
| --- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Selalu isolasi layer saat debugging**                  | Tes dari dalam server (localhost) untuk membuktikan apakah masalah ada di Golang, NGINX, atau Cloudflare.                 |
| 2   | **Mode SSL "Off" di Cloudflare memutus `wss://`**        | WebSocket Secure membutuhkan negosiasi TLS aktif. Mode "Off" tidak memproses ini.                                         |
| 3   | **Cloudflare mengubah header HTTP**                      | Header `Connection` dan `Upgrade` bisa dihilangkan/diubah saat melewati proxy Cloudflare. Hardcode di NGINX.              |
| 4   | **Cloudflare menyembunyikan IP asli**                    | Gunakan `real_ip_header CF-Connecting-IP` + daftar `set_real_ip_from` agar NGINX dan Fail2Ban membaca IP pengunjung asli. |
| 5   | **Browser menyembunyikan Response Header pada WS gagal** | Jika WebSocket handshake gagal (non-101), Chrome membuang response headers. Gunakan `curl` untuk melihat respons mentah.  |

---

_Dokumen ini dibuat pada 24 April 2026 sebagai referensi deployment Nadi._ 🛡️
