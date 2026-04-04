# Technical Documentation: Logging System

Dokumentasi ini menjelaskan arsitektur, konfigurasi, dan cara penggunaan sistem logging di aplikasi Go-React Starter.

## 1. Arsitektur Logging (Hybrid Mode)
Aplikasi ini menggunakan pendekatan **Hybrid** untuk menyeimbangkan antara kemudahan pencarian (Admin Dashboard) dan performa (File Logging).

| Tipe Log | Penyimpanan | Tujuan Utama | Akses |
| :--- | :--- | :--- | :--- |
| **Teknis** | File `.log` | Debugging, monitoring sistem, error tracing. | Server / SFTP |
| **Operasional** | Database | Searchability, Dashboard Admin, Audit trail. | Admin Dashboard (UI) |

---

## 2. Konfigurasi (`.env`)
Pengaturan log dikendalikan melalui variabel lingkungan berikut:

- `LOG_DIR`: Direktori penyimpanan file log (default: `./storage/logs`).
- `LOG_LEVEL`: Level log minimum (`debug`, `info`, `warn`, `error`). Disarankan `info` untuk produksi.
- `LOG_RETENTION_DAYS`: Jumlah hari log disimpan sebelum dihapus otomatis (default: `30`).

---

## 3. Komponen Utama

### A. Package `pkg/logger`
Wrapper di atas library `zerolog` (sangat cepat) dan `lumberjack` (rotasi file).
- `logger.SystemLogger`: Log umum aplikasi.
- `logger.DBLogger`: Log query database (GORM).
- `logger.AuditLogger`: Log untuk aktivitas audit user.

### B. Middleware [RequestLogger](file:///c:/Users/Gositus%20Hadi/code/go-react-starter/backend/internal/middleware/request_logger.go#56-153)
Middleware (di [internal/middleware/request_logger.go](file:///c:/Users/Gositus%20Hadi/code/go-react-starter/backend/internal/middleware/request_logger.go)) yang mencatat setiap request HTTP masuk.
- Mencatat ke **File** (`system.log`) menggunakan zerolog.
- Mencatat ke **Database** (tabel `http_logs`) menggunakan repository.
- Melakukan **Data Masking** otomatis untuk field sensitif seperti `password`, `email`, dan `token`.

### C. Auto-Cleanup (Retention)
- **File**: Menggunakan fitur `MaxAge` dari library lumberjack.
- **Database**: Fungsi [DeleteOldLogs](file:///c:/Users/Gositus%20Hadi/code/go-react-starter/backend/pkg/logger/logger.go#42-43) dijalankan di background saat aplikasi *startup* (di [main.go](file:///c:/Users/Gositus%20Hadi/code/go-react-starter/backend/cmd/api/main.go)) untuk menghapus baris data yang sudah usang berdasarkan `LOG_RETENTION_DAYS`.

---

## 4. Cara Penggunaan bagi Developer

### Logging Sederhana
Gunakan `logger.SystemLogger` untuk log biasa. Gunakan [WithCtx](file:///c:/Users/Gositus%20Hadi/code/go-react-starter/backend/pkg/logger/logger.go#101-119) agar `request_id` dan `user_id` ikut tercatat.
```go
logger.WithCtx(ctx.Request.Context(), logger.SystemLogger).Info().
    Str("user_email", email).
    Msg("User logged in successfully")
```

### Logging Audit (Penting!)
Untuk mencatat aksi krusial (misal: menghapus data), gunakan `logger.LogAudit`. Ini akan menyimpan log ke file DAN database.
```go
logger.LogAudit(ctx.Request.Context(), "delete-user", "user-management", userID, "User deleted due to inactivity")
```

### Response Error
Gunakan helper `response.Error` untuk standarisasi output JSON error sekaligus melakukan logging secara otomatis.

---

## 5. Tips Troubleshooting
- Jika log tidak muncul, cek `LOG_LEVEL` di `.env`.
- Jika file log membesar terlalu cepat, cek `LOG_RETENTION_DAYS`.
- Jika database log terlalu penuh, jalankan ulang aplikasi atau atur retensi lebih rendah.
