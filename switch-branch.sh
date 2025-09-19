#!/bin/bash
set -e

BRANCH=$1

if [ -z "$BRANCH" ]; then
  echo "⚠️  Usage: ./switch-branch.sh <branch>"
  echo "Contoh: ./switch-branch.sh dev"
  exit 1
fi

# Pastikan semua commit sudah bersih sebelum pindah
if ! git diff-index --quiet HEAD --; then
  echo "⚠️  Ada perubahan yang belum di-commit. Commit atau stash dulu sebelum pindah branch."
  exit 1
fi

# Cek apakah branch sudah ada
if git show-ref --verify --quiet refs/heads/$BRANCH; then
  echo "🔀 Checkout branch $BRANCH"
  git checkout $BRANCH
  git pull
else
  echo "✨ Branch $BRANCH belum ada, buat dari current branch"
  git checkout -b $BRANCH
  git push -u origin $BRANCH
fi

echo "✅ Sekarang kamu ada di branch: $(git branch --show-current)"
