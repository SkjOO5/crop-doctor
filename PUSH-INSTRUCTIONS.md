# 🚀 Push to GitHub - Simple Instructions

## Step 1: Create GitHub Repository (2 minutes)

1. Go to: https://github.com/new
2. Fill in:
   - **Repository name:** `crop-doctor-ai`
   - **Description:** `AI-powered crop disease detection system for Indian farmers`
   - **Visibility:** Public
   - **DON'T** check "Initialize with README"
3. Click "Create repository"

## Step 2: Get Your GitHub Username

Remember your GitHub username (e.g., `john-doe`)

## Step 3: Copy and Run These Commands

Open PowerShell and run these commands ONE BY ONE:

```powershell
# Navigate to project folder
cd "C:\Users\lenovo\OneDrive\Desktop\Dr. Crop\extracted"

# Add your GitHub remote (REPLACE YOUR_USERNAME with your actual username)
git remote add origin https://github.com/YOUR_USERNAME/crop-doctor-ai.git

# Set branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Enter Credentials

When prompted:
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token** (NOT your password!)

### How to Get Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name it: `Crop Doctor AI`
4. Select scope: ✅ `repo` (full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password when pushing

---

## ✅ That's It!

After successful push, your repository will be at:
`https://github.com/YOUR_USERNAME/crop-doctor-ai`

---

## 🎯 Quick Copy-Paste (Replace YOUR_USERNAME)

```powershell
cd "C:\Users\lenovo\OneDrive\Desktop\Dr. Crop\extracted"
git remote add origin https://github.com/YOUR_USERNAME/crop-doctor-ai.git
git branch -M main
git push -u origin main
```

---

## ❌ If You Get Errors

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/crop-doctor-ai.git
```

### Error: "repository not found"
- Make sure you created the repository on GitHub first
- Check the username is correct

### Error: "authentication failed"
- Use Personal Access Token, not your password
- Make sure token has `repo` scope

---

## 🎉 After Successful Push

Add these topics to your repository:
- `agriculture`
- `ai`
- `crop-disease`
- `nextjs`
- `typescript`
- `gemini-ai`
- `indian-farmers`
- `fertilizer`
- `multi-language`
- `pwa`

**Your project is now live on GitHub!** 🌾🚀
