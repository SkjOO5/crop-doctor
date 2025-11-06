# 🚀 GitHub Setup Guide

## Step 1: Initialize Git Repository

```bash
cd extracted
git init
```

## Step 2: Create .gitignore

The `.gitignore` file is already created. It excludes:
- node_modules
- .env files
- Database files
- Uploaded images
- Temporary documentation
- External repo folders
- ZIP files

## Step 3: Remove Unnecessary Files

Before committing, remove these files/folders:

```bash
# Remove external repos
rm -rf fasal-mitra/
rm -rf fasal-frontend/
rm -rf plant-disease/
rm -rf fasal-mitra-repo/
rm -rf plant-disease-repo/

# Remove ZIP files
rm *.zip

# Remove old source code
rm -rf src/
rm code.zip

# Remove temporary documentation (keep main README)
rm *-GUIDE.md
rm *-SUMMARY.md
rm *-FIXED.md
rm *-APPLIED.md
rm *-TROUBLESHOOTING.md
rm *-INTEGRATION.md
rm WHATS-NEW.md
rm CHANGES-MADE.md
```

## Step 4: Stage Files

```bash
git add .
```

## Step 5: Create Initial Commit

```bash
git commit -m "Initial commit: Crop Doctor AI - Smart Agriculture Disease Detection System

Features:
- AI-powered disease detection using Gemini 2.5 Flash
- Smart fertilizer recommendations with government pricing
- 22 Indian language support
- Farm diary with offline support
- Weather integration
- Beautiful agriculture-themed UI with dark mode
- Complete backend with Prisma + SQLite
- Image storage and detection history
- PWA ready"
```

## Step 6: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `crop-doctor-ai`
3. Description: `AI-powered crop disease detection system with fertilizer recommendations for Indian farmers`
4. Choose Public or Private
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

## Step 7: Add Remote and Push

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/crop-doctor-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 8: Add Topics (on GitHub)

Add these topics to your repository for better discoverability:
- agriculture
- ai
- crop-disease
- nextjs
- typescript
- gemini-ai
- indian-farmers
- fertilizer
- multi-language
- pwa

## Step 9: Set Up GitHub Pages (Optional)

If you want to host documentation:
1. Go to Settings > Pages
2. Source: Deploy from a branch
3. Branch: main / docs
4. Save

## Step 10: Add Repository Secrets (for CI/CD)

If you plan to use GitHub Actions:
1. Go to Settings > Secrets and variables > Actions
2. Add: `GOOGLE_GENERATIVE_AI_API_KEY`

## 📋 Checklist

Before pushing to GitHub, ensure:

- [ ] `.gitignore` is in place
- [ ] `.env.local` is NOT committed (should be in .gitignore)
- [ ] README.md is comprehensive
- [ ] LICENSE file is present
- [ ] CONTRIBUTING.md is present
- [ ] All external repos removed
- [ ] All ZIP files removed
- [ ] Temporary documentation removed
- [ ] Database file excluded (.gitignore)
- [ ] node_modules excluded (.gitignore)

## 🎯 What Gets Committed

### ✅ Include
- Source code (app/, components/, lib/)
- Configuration files (package.json, tsconfig.json, etc.)
- Prisma schema
- Public assets (except uploads)
- Documentation (README, CONTRIBUTING, LICENSE)
- .gitignore

### ❌ Exclude
- node_modules/
- .env files
- Database files (dev.db)
- Uploaded images
- Build output (.next/)
- External repos
- ZIP files
- Temporary docs

## 🔒 Security Notes

**Never commit:**
- API keys
- Database credentials
- Private keys
- User data
- Uploaded images (optional)

**Always:**
- Use environment variables
- Add sensitive files to .gitignore
- Review commits before pushing
- Use GitHub secrets for CI/CD

## 📝 Commit Message Guidelines

Use conventional commits:

```bash
# Features
git commit -m "feat: add crop calendar feature"

# Bug fixes
git commit -m "fix: resolve image upload issue"

# Documentation
git commit -m "docs: update README with new features"

# Styling
git commit -m "style: improve dark mode colors"

# Refactoring
git commit -m "refactor: optimize fertilizer service"

# Performance
git commit -m "perf: reduce image processing time"
```

## 🎉 You're Done!

Your project is now on GitHub! Share it with:
- Fellow developers
- Farmers and agricultural organizations
- Open source community

## 📞 Need Help?

- GitHub Docs: https://docs.github.com
- Git Basics: https://git-scm.com/doc
- Open an issue if you face problems

Happy coding! 🌾
