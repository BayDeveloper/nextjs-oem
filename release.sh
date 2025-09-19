#!/bin/bash
set -e

DEV_BRANCH="dev"
MAIN_BRANCH="main"
INPUT_TAG=$1
HOOKS_DIR=".git/hooks"

# === Fungsi setup hooks ===
setup_hooks() {
  echo "⚙️  Setup git hooks..."

  # Pre-commit hook
  cat > "$HOOKS_DIR/pre-commit" <<'EOF'
#!/bin/bash
# Pre-commit hook untuk mencegah file .env (kecuali .env.example) masuk repo

echo "🔍 Mengecek file .env sebelum commit..."

STAGED_ENVS=$(git diff --cached --name-only | grep -E '^\.env')

if [ -n "$STAGED_ENVS" ]; then
  for file in $STAGED_ENVS; do
    if [[ "$file" != ".env.example" ]]; then
      echo "❌ ERROR: File sensitif '$file' tidak boleh di-commit!"
      echo ""
      echo "💡 Tips:"
      echo "  - File .env berisi credential rahasia."
      echo "  - Jangan pernah commit ke repo publik."
      echo "  - Gunakan .env.example untuk template."
      echo ""
      echo "➡️  Solusi cepat:"
      echo "     git reset HEAD $file"
      echo "     echo '$file' >> .gitignore"
      exit 1
    fi
  done
fi

echo "✅ Aman! Tidak ada file .env yang di-commit."
exit 0
EOF
  chmod +x "$HOOKS_DIR/pre-commit"

  # Pre-push hook
  cat > "$HOOKS_DIR/pre-push" <<'EOF'
#!/bin/bash
# Pre-push hook untuk memastikan file/folder tertentu tidak ikut ke repo

FORBIDDEN_PATHS=(
  "combined/"
  ".next/"
  "build/"
)

echo "🔍 Mengecek file terlarang sebelum push..."

for path in "${FORBIDDEN_PATHS[@]}"; do
  if git ls-files --error-unmatch "$path" &> /dev/null; then
    echo "❌ ERROR: '$path' masih ter-track di git."
    echo ""
    echo "💡 Tips:"
    echo "  - Folder $path hanya file build/cache, tidak perlu di-push."
    echo "  - Pastikan sudah ada di .gitignore."
    echo ""
    echo "➡️  Solusi cepat:"
    echo "     git rm -r --cached $path"
    echo "     git commit -m 'chore: remove $path from repo'"
    exit 1
  fi
done

echo "✅ Aman! Tidak ada file terlarang. Lanjut push..."
echo "ℹ️  Reminder workflow release:"
echo "   - Kerja harian di branch dev"
echo "   - Rilis pakai ./release.sh"
echo "   - Jangan commit file .env atau folder build"
exit 0
EOF
  chmod +x "$HOOKS_DIR/pre-push"

  echo "🎉 Hooks berhasil dipasang!"
}

# === Auto-setup hooks kalau belum ada ===
if [ ! -f "$HOOKS_DIR/pre-commit" ] || [ ! -f "$HOOKS_DIR/pre-push" ]; then
  setup_hooks
fi

# === Fungsi increment patch version ===
increment_version() {
  local version=$1
  local prefix=""

  if [[ $version == v* ]]; then
    prefix="v"
    version=${version:1}
  fi

  IFS='.' read -r major minor patch <<< "$version"
  patch=$((patch+1))
  echo "${prefix}${major}.${minor}.${patch}"
}

# === Tentukan tag ===
if [ -n "$INPUT_TAG" ]; then
  TAG=$INPUT_TAG
else
  if git describe --tags --abbrev=0 >/dev/null 2>&1; then
    LAST_TAG=$(git describe --tags --abbrev=0)
    TAG=$(increment_version "$LAST_TAG")
    echo "ℹ️  Tidak ada argumen versi. Auto increment dari $LAST_TAG → $TAG"
  else
    TAG="v1.0.0"
    echo "ℹ️  Belum ada tag sebelumnya. Mulai dengan $TAG"
  fi
fi

echo "🚀 Mulai release: merge $DEV_BRANCH ↔ $MAIN_BRANCH (tag $TAG)"

# === Stash perubahan kalau ada ===
if ! git diff-index --quiet HEAD --; then
  echo "⚠️ Ada perubahan lokal, menyimpan dengan stash..."
  git stash push -m "auto-stash sebelum release"
  STASHED=true
else
  STASHED=false
fi

# === Checkout main ===
echo "🔀 Pindah ke $MAIN_BRANCH..."
git checkout $MAIN_BRANCH
git pull origin $MAIN_BRANCH

# === Merge dev → main ===
echo "🔄 Merge dari $DEV_BRANCH ke $MAIN_BRANCH..."
git merge $DEV_BRANCH --no-ff -m "Release: merge $DEV_BRANCH into $MAIN_BRANCH"
git push origin $MAIN_BRANCH

# === Tambahkan tag ===
echo "🏷️ Membuat tag versi $TAG..."
git tag -a "$TAG" -m "Release $TAG"
git push origin "$TAG"

# === Checkout dev ===
echo "🔀 Pindah ke $DEV_BRANCH..."
git checkout $DEV_BRANCH
git pull origin $DEV_BRANCH

# === Merge main → dev ===
echo "🔄 Merge balik dari $MAIN_BRANCH ke $DEV_BRANCH..."
git merge $MAIN_BRANCH --no-ff -m "Sync: merge $MAIN_BRANCH into $DEV_BRANCH"
git push origin $DEV_BRANCH

# === Restore stash kalau ada ===
if [ "$STASHED" = true ]; then
  echo "📦 Mengembalikan perubahan dari stash..."
  git stash pop || echo "⚠️ Tidak ada stash untuk dipop, mungkin sudah kosong."
fi

echo "✅ Release selesai! $MAIN_BRANCH dan $DEV_BRANCH sinkron (tag $TAG dibuat)."
