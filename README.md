📦 Nextjs-OEM Git Workflow

Repo ini menggunakan workflow sederhana dengan 2 branch utama:

dev → tempat kerja harian (development, fitur baru, bugfix).

main → branch stabil (production-ready).

Tiga file .sh membantu otomatisasi workflow:

🚀 1. deploy-to-github.sh

Tujuan: inisialisasi repo & push pertama kali ke GitHub.

./deploy-to-github.sh

git push -u origin dev

✅ Fungsi:

Membuat repo GitHub (jika belum ada).

Menambahkan remote origin.

Commit awal (exclude folder combined/).

Push ke GitHub.

📌 Jalankan sekali saja di awal project.

🔀 2. switch-branch.sh

Tujuan: pindah branch dengan aman.

./switch-branch.sh <branch>


Contoh:

./switch-branch.sh dev
./switch-branch.sh main


✅ Fungsi:

Menolak pindah branch kalau ada perubahan belum di-commit/stash.

Checkout branch yang sudah ada.

Kalau branch belum ada → dibuat otomatis & push ke GitHub.

📌 Gunakan ini saat mau pindah kerja antar branch.

🏷️ 3. release.sh

Tujuan: rilis versi baru dari dev ke main.

./release.sh


Atau tentukan versi manual:

./release.sh v1.1.0


✅ Fungsi:

Stash perubahan lokal sementara.

Checkout main & merge dari dev.

Buat tag versi (vX.Y.Z).

Push main + tag ke GitHub.

Checkout dev lagi.

Merge balik main → dev.

Restore perubahan lokal.

📌 Jalankan setiap kali mau buat release baru.

🔄 Alur Workflow
dev (kerja harian)  →  ./release.sh  →  main (stabil)
                              ↓
                       tag v1.0.3 dibuat
                              ↓
                ./release.sh sync main → dev

⚡ Best Practice

Kerjakan fitur & bugfix di dev.

Jalankan ./release.sh saat siap rilis stabil.

Tag versi otomatis (v1.0.0, v1.0.1, dst).
