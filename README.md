Oke, ini draft Developer Guide yang bisa langsung kamu tempel ke README.md biar developer lain langsung ngerti cara kerja repo-mu:

🚀 Developer Guide
🏗️ Branch Workflow

dev → branch untuk pengembangan harian. Semua fitur/bugfix merge ke sini.

main → branch stabil untuk rilis ke production.

🔀 Switch Branch

Gunakan script:

./switch-branch.sh dev
./switch-branch.sh main


Kalau ada perubahan belum di-commit dan ingin pindah paksa:

./switch-branch.sh dev --force

📦 Release Workflow

Gunakan script release.sh untuk merilis:

./release.sh


Akan otomatis merge dev → main, push, bikin tag versi, lalu merge balik main → dev.

Kalau tidak kasih versi, patch version naik otomatis (misalnya v1.0.0 → v1.0.1).

Kalau mau tentukan versi sendiri:

./release.sh v2.0.0

🛡️ Git Hooks (Keamanan Otomatis)

Hooks dipasang otomatis saat pertama kali menjalankan ./release.sh:

Pre-commit hook

Mencegah file .env* (kecuali .env.example) ikut di-commit.

Kalau ketemu → commit ditolak + solusi cepat ditampilkan.

Pre-push hook

Mencegah folder temporary seperti combined/, .next/, build/ ikut ke repo.

Kalau ketemu → push ditolak + solusi cepat ditampilkan.

Reminder workflow release ditampilkan sebelum push lanjut.

📖 Contoh Alur Kerja

Buat perubahan di dev, lalu commit:

git add .
git commit -m "feat: tambah fitur baru"


Push ke GitHub:

git push


Saat siap rilis versi baru:

./release.sh


atau tentukan versi manual:

./release.sh v1.1.0
