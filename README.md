# JasaSuruh Modern

Versi MVP JasaSuruh dengan:
- HTML + CSS + JavaScript modern
- PHP + MySQL sebagai backend
- Registrasi dan login
- Dashboard pelanggan
- Membuat pesanan
- Riwayat pesanan
- Status pesanan dasar

## Struktur

- `index.html` — landing page
- `login.html` — login
- `register.html` — registrasi
- `dashboard.html` — dashboard pelanggan
- `order.html` — membuat pesanan
- `orders.html` — riwayat pesanan
- `assets/css/style.css` — semua styling
- `assets/js/app.js` — interaksi frontend + API
- `api/*.php` — backend
- `database.sql` — database dan tabel

## Instalasi di XAMPP

1. Ekstrak folder `jasasuruh-modern` ke `C:\xampp\htdocs\`.
2. Jalankan Apache dan MySQL.
3. Buka `http://localhost/phpmyadmin`.
4. Pilih menu **Import** setelah masuk ke halaman phpMyAdmin, lalu import `database.sql`.
   Alternatif: buka menu **SQL** dan paste isi file `database.sql`.
5. Buka `http://localhost/jasasuruh-modern/`.

## Akun admin demo

Email: `admin@jasasuruh.test`

Password database demo: `password`

Catatan: hash password demo di `database.sql` harus cocok dengan password `password`. Bila instalasi lama, buat ulang database atau update hash admin menggunakan PHP password_hash.

## Pengaturan database

File `api/config.php` memakai:
- host: `127.0.0.1`
- database: `jasasuruh`
- user: `root`
- password: kosong

Ubah sesuai konfigurasi MySQL kamu bila berbeda.
