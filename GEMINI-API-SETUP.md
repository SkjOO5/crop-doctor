# 🔧 Gemini API Setup Guide

## The Problem
Your image recognition isn't working because:
1. **Wrong API approach**: Fasal-Mitra uses a custom PyTorch model, NOT Gemini
2. **API Key issues**: Gemini API needs proper configuration
3. **Model selection**: Need to use the right Gemini model

## ✅ Solution: Use Google's Gemini Vision API

### Step 1: Get Your API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy your API key

### Step 2: Add API Key to Your Project

Create a `.env.local` file in your `extracted` folder:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

### Step 3: Verify the API Works

Test your API key with this command:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"
```

You should see a list of available models including:
- `gemini-1.5-flash` (FREE, fast, good for images)
- `gemini-1.5-pro` (More powerful but has limits)

### Step 4: Install Dependencies

```bash
cd extracted
npm install @google/generative-ai
```

### Step 5: Restart Your Dev Server

```bash
npm run dev
```

## 🆚 Comparison: Gemini API vs Custom Model

### Option 1: Gemini API (Current Implementation)
**Pros:**
- ✅ No training needed
- ✅ Works immediately with API key
- ✅ Handles any crop/disease
- ✅ Provides detailed explanations
- ✅ Free tier available

**Cons:**
- ❌ Requires internet connection
- ❌ API rate limits
- ❌ Less accurate than specialized models
- ❌ Costs money after free tier

### Option 2: Custom PyTorch Model (Like Fasal-Mitra)
**Pros:**
- ✅ Very accurate for trained diseases
- ✅ Works offline
- ✅ No API costs
- ✅ Fast predictions

**Cons:**
- ❌ Requires Python backend
- ❌ Need to train/download model
- ❌ Only recognizes 38 specific diseases
- ❌ More complex setup

## 🎯 Recommended Approach

**For your project, use Gemini API because:**
1. Easier to implement (already done!)
2. Works with any crop/disease
3. Provides detailed explanations in multiple languages
4. No need for Python backend

## 🔍 Testing Your Setup

1. Make sure `.env.local` has your API key
2. Restart the dev server
3. Upload a plant image
4. Check the browser console for logs
5. Check the terminal for API responses

## 🐛 Troubleshooting

### Error: "API key not configured"
- Add your API key to `.env.local`
- Restart the dev server

### Error: "Model not found"
- Use `gemini-1.5-flash` (it's free and works!)
- Check your API key has access to Gemini models

### Error: "Rate limit exceeded"
- You've hit the free tier limit
- Wait a few minutes or upgrade your plan

### Image not being recognized
- Make sure image is in base64 format
- Check image size (max 4MB for Gemini)
- Verify mime type is correct (jpeg, png, webp)

## 📊 API Limits (Free Tier)

- **gemini-1.5-flash**: 15 requests per minute
- **gemini-1.5-pro**: 2 requests per minute
- Daily limit: 1,500 requests

## 🚀 Next Steps

If you want even better accuracy, you can:
1. Use Gemini API for now (quick solution)
2. Later, add a Python backend with a custom model
3. Use both: Gemini for general analysis, custom model for specific diseases

## 💡 Alternative: Use Hugging Face Models

If Gemini doesn't work, you can use free Hugging Face models:
- Plant Disease Detection models
- No API key needed
- Run in browser with TensorFlow.js

Let me know if you want me to implement this alternative!
