# 🚀 Deploy Crop Doctor AI to Vercel

## Quick Start (5 Minutes)

### Step 1: Prepare Your API Keys
Before deploying, make sure you have:
- ✅ **Gemini API Key** - Get from https://makersuite.google.com/app/apikey
- ✅ **Weather API Key** - Get from https://openweathermap.org/api

### Step 2: Deploy to Vercel

#### Option A: One-Click Deploy (Easiest)
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste: `https://github.com/SkjOO5/crop-doctor`
4. Click "Import"

#### Option B: From Vercel Dashboard
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Select `crop-doctor` from your repositories
4. Click "Import"

### Step 3: Configure Build Settings
Vercel will auto-detect Next.js. Verify these settings:

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Step 4: Add Environment Variables
Click "Environment Variables" and add these:

| Name | Value |
|------|-------|
| `GEMINI_API_KEY` | Your Gemini API key |
| `WEATHER_API_KEY` | Your Weather API key |
| `DATABASE_URL` | `file:./dev.db` (temporary) |

**How to add:**
1. Click "+ Add Another"
2. Enter Name and Value
3. Select all environments (Production, Preview, Development)
4. Click "Add"

### Step 5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes ⏳
3. Your app will be live! 🎉

---

## 🗄️ Database Setup (Important!)

SQLite doesn't work on Vercel (serverless environment). Choose one option:

### Option 1: Vercel Postgres (Recommended)

**Free Tier:** 256 MB storage, 60 hours compute

1. In Vercel dashboard, go to your project
2. Click "Storage" tab
3. Click "Create Database" → "Postgres"
4. Click "Create"
5. Go to ".env.local" tab
6. Copy the `POSTGRES_PRISMA_URL`
7. Update environment variable:
   - Name: `DATABASE_URL`
   - Value: (paste the URL)

**Update Prisma Schema:**
```prisma
datasource db {
  provider = "postgresql"  // Change from sqlite
  url      = env("DATABASE_URL")
}
```

### Option 2: Supabase (Free Forever)

**Free Tier:** 500 MB database, unlimited API requests

1. Go to https://supabase.com
2. Click "Start your project"
3. Create new project
4. Go to Settings → Database
5. Copy "Connection string" (URI)
6. Replace `[YOUR-PASSWORD]` with your password
7. Add to Vercel environment variables:
   - Name: `DATABASE_URL`
   - Value: (paste the connection string)

**Update Prisma Schema:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Option 3: PlanetScale (Free)

**Free Tier:** 5 GB storage, 1 billion row reads/month

1. Go to https://planetscale.com
2. Create account and new database
3. Click "Connect"
4. Select "Prisma"
5. Copy the connection string
6. Add to Vercel environment variables

**Update Prisma Schema:**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

---

## 🔄 After Changing Database

If you switch databases, you need to:

### 1. Update Prisma Schema
Edit `prisma/schema.prisma` with the new provider

### 2. Push Changes to GitHub
```bash
git add .
git commit -m "Update database for Vercel deployment"
git push origin main
```

### 3. Redeploy on Vercel
Vercel will automatically redeploy when you push to GitHub

### 4. Run Migrations
In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add: `PRISMA_GENERATE_SKIP_AUTOINSTALL=true`
3. Redeploy

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain
1. Go to your project in Vercel
2. Click "Settings" → "Domains"
3. Enter your domain name
4. Follow DNS configuration instructions

### Free Vercel Domain
Your app is automatically available at:
`https://crop-doctor-[random].vercel.app`

You can customize it:
1. Go to Settings → Domains
2. Click "Edit" next to your Vercel domain
3. Enter preferred name: `crop-doctor-ai.vercel.app`

---

## 🔧 Troubleshooting

### Build Fails
**Error:** "Cannot find module 'prisma'"
**Fix:** Make sure `prisma` is in `devDependencies` in package.json

**Error:** "Database connection failed"
**Fix:** Check your `DATABASE_URL` environment variable

### API Routes Not Working
**Error:** "API route not found"
**Fix:** Make sure all API routes are in `app/api/` directory

### Environment Variables Not Working
**Fix:** 
1. Make sure variables are added to all environments
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

### Images Not Loading
**Error:** "Failed to load image"
**Fix:** Use Vercel Blob Storage for images:
1. Go to Storage → Create → Blob
2. Update image upload code to use Vercel Blob

---

## 📊 Deployment Checklist

Before deploying, make sure:

- [ ] GitHub repository is up to date
- [ ] All environment variables are ready
- [ ] Database provider is configured (not SQLite)
- [ ] API keys are valid and active
- [ ] `.env` file is in `.gitignore` (don't commit secrets!)
- [ ] `package.json` has all dependencies
- [ ] Build works locally: `npm run build`

---

## 🎯 Post-Deployment

After successful deployment:

### 1. Test Your App
- Visit your Vercel URL
- Test disease detection
- Test fertilizer recommendations
- Test language switching
- Test weather integration

### 2. Monitor Performance
- Go to Vercel dashboard → Analytics
- Check response times
- Monitor error rates

### 3. Set Up Continuous Deployment
Already done! Every push to `main` branch will auto-deploy.

---

## 💡 Pro Tips

### 1. Preview Deployments
Every pull request gets a preview URL automatically

### 2. Environment Variables per Branch
Set different API keys for production vs preview

### 3. Edge Functions
Your API routes run on Vercel Edge Network (super fast!)

### 4. Automatic HTTPS
Vercel provides free SSL certificates

### 5. Global CDN
Your app is served from 100+ locations worldwide

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Next.js on Vercel:** https://vercel.com/docs/frameworks/nextjs
- **Prisma on Vercel:** https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel

---

## 🎉 Your App is Live!

Once deployed, your Crop Doctor AI will be accessible at:
`https://crop-doctor-[your-id].vercel.app`

Share it with farmers and help improve agriculture! 🌾

---

## 📞 Need Help?

- Vercel Support: https://vercel.com/support
- Vercel Community: https://github.com/vercel/vercel/discussions
- Next.js Discord: https://nextjs.org/discord

**Happy Deploying!** 🚀
