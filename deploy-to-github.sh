#!/bin/bash
set -e

# === Konfigurasi ===
GITHUB_USER="BayDeveloper"     # username GitHub
REPO_NAME="nextjs-oem"
BRANCH="main"
PRIVATE="false"  # ubah ke "true" kalau mau repo private

# === Pastikan gh CLI tersedia ===
if ! command -v gh &> /dev/null; then
  echo "❌ GitHub CLI (gh) belum terinstall."
  echo "➡️  Install: https://cli.github.com/manual/installation"
  exit 1
fi

# === Login GitHub kalau belum ===
if ! gh auth status &> /dev/null; then
  echo "🔑 Silakan login GitHub CLI..."
  gh auth login
fi

# === Buat repo di GitHub kalau belum ada ===
if ! gh repo view $GITHUB_USER/$REPO_NAME &> /dev/null; then
  echo "📦 Membuat repo $REPO_NAME di GitHub..."
  if [ "$PRIVATE" = "true" ]; then
    gh repo create $GITHUB_USER/$REPO_NAME --private --confirm
  else
    gh repo create $GITHUB_USER/$REPO_NAME --public --confirm
  fi
else
  echo "✅ Repo $REPO_NAME sudah ada di GitHub"
fi

# === Inisialisasi Git ===
if [ ! -d ".git" ]; then
  echo "🚀 Inisialisasi git repo lokal..."
  git init
  git branch -M $BRANCH
fi

# === Set remote ===
REMOTE_URL=$(gh repo view $GITHUB_USER/$REPO_NAME --json sshUrl --jq .sshUrl)
if git remote get-url origin &> /dev/null; then
  echo "✅ Remote origin sudah ada: $(git remote get-url origin)"
else
  echo "🔗 Menambahkan remote origin $REMOTE_URL"
  git remote add origin $REMOTE_URL
fi

# === Tambah & commit ===
echo "📝 Menambahkan semua file..."
git add .
if git diff-index --quiet HEAD --; then
  echo "⚠️ Tidak ada perubahan untuk di-commit."
else
  git commit -m "Initial commit: Nextjs-OEM frontend"
fi

# === Push ke GitHub ===
echo "📤 Push ke GitHub..."
git push -u origin $BRANCH

echo "🎉 Selesai! Repo siap diakses di:"
gh repo view $GITHUB_USER/$REPO_NAME --web
