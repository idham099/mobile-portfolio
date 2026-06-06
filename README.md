# Mobile Automation Framework (Appium + Cucumber)

Framework pengujian otomatis untuk aplikasi mobile Android (SwagLabs) yang dirancang untuk stabilitas tinggi, kemudahan pelaporan, dan alur kerja yang sistematis.

kamu bisa menggunakan aplikasi ini untuk automation:
1. Mobile App: https://github.com/saucelabs/sample-app-mobile/releases


## 🚀 Fitur Utama
* **BDD Approach:** Menggunakan format *Given-When-Then* untuk keterbacaan skenario.
* **Sequential Execution:** Menjalankan tes secara berurutan sesuai penomoran file (01_login, 02_checkout, dst).
* **System Stability:**
    * **Automatic Cache Clearing:** Perintah `pm clear` dijalankan setelah setiap skenario untuk memastikan aplikasi selalu *fresh*.
    * **Session Management:** `browser.reloadSession()` dipanggil setelah setiap file selesai untuk mencegah *memory leak*.
* **Smart Reporting:** Allure Report interaktif dengan *screenshot* otomatis saat error maupun saat berhasil mencapai langkah penting.

## 🛠 Prerequisites
* Node.js (Versi 18+)
* Appium Server & Driver (`uiautomator2`)
* Android Studio (Emulator)
* Java JDK

## ⚙️ Instalasi
1. Clone repositori ini:
   ```bash
   git clone <URL_REPOSITORI_ANDA>
   cd <NAMA_FOLDER_PROYEK>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## 🏃 Cara Menjalankan Tes
Pastikan Emulator Android sudah dalam kondisi Running.

1. Jalankan semua skenario:
   ```bash
   npm run test:all
   ```
* (Perintah ini akan menjalankan seluruh tes, memberikan jeda 10 detik, lalu membuka laporan Allure secara otomatis).

2. Generate laporan secara manual:
    ```bash
    npm run report:generate
    ```

## 🏗 Struktur Proyek
* /features: Berisi skenario tes .feature (Gunakan awalan angka seperti 01_...).
* /features/step-definitions: Berisi logika kode (TypeScript) untuk menjalankan perintah.
* /allure-config: Konfigurasi tambahan untuk kebutuhan reporting.
* wdio.conf.ts: File konfigurasi pusat (Hooks, Capabilities, dan Timeout).


## 💡 Alur Kerja QA (Best Practice)
Framework ini didesain agar Anda tidak perlu pusing dengan emulator yang hang. Berikut alur kerjanya:

1. Inisialisasi: Memulai koneksi ke Appium.
2. Execution: Menjalankan skenario secara sekuensial.
3. Clean-up:
    * afterScenario: Membersihkan cache aplikasi (pm clear).
    * after: Mereset sesi WebDriver (reloadSession).
4. Reporting: Screenshot diambil otomatis jika terjadi error atau di titik kritis (Product Dashboard), lalu laporan digenerate ke Allure.

## 📋 Konfigurasi Hooks (wdio.conf.ts)
Kami menerapkan best practice di dalam wdio.conf.ts untuk stabilitas:
    
    ```bash
    // Membersihkan cache setelah skenario
        afterScenario: async function (world, result, context) {
            await browser.execute('mobile: shell', { command: 'pm clear com.swaglabsmobileapp' });
        },

    // Mereset sesi setelah satu file feature selesai
        after: async function (result, capabilities, specs) {
            await browser.reloadSession();
        },
    ```
## 📄 License
Proyek ini dilisensikan di bawah MIT License. Silakan gunakan untuk keperluan portofolio atau pengembangan profesional Anda.

Dibuat dengan fokus pada stabilitas dan efisiensi pengujian mobile.
---

Setelah Anda simpan, jangan lupa untuk segera membuat file **`.gitignore`** di folder yang sama agar *folder sampah* tidak ikut ter-upload:

1. Buat file baru, beri nama `.gitignore`.
2. Isi dengan teks berikut:
   ```text
   node_modules/
   allure-results/
   allure-report/
   .env
   wdio.log
   ```
