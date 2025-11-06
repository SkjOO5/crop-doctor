// Quick test script to verify your Gemini API key works
// Run with: node test-gemini-api.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Replace with your actual API key or set GOOGLE_GENERATIVE_AI_API_KEY environment variable
const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "YOUR_API_KEY_HERE";

async function testGeminiAPI() {
  console.log("🧪 Testing Gemini API...\n");

  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
    console.error("❌ ERROR: Please set your API key!");
    console.log("\nOptions:");
    console.log("1. Set environment variable: GOOGLE_GENERATIVE_AI_API_KEY=your_key");
    console.log("2. Edit this file and replace YOUR_API_KEY_HERE with your actual key");
    console.log("\nGet your API key from: https://makersuite.google.com/app/apikey");
    process.exit(1);
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    console.log("✅ API key loaded");
    console.log("📡 Testing connection to Gemini...\n");

    // Test with a simple text prompt first
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent("Say 'Hello, I am working!' in one sentence.");
    const response = result.response;
    const text = response.text();

    console.log("✅ SUCCESS! Gemini API is working!");
    console.log("\n📝 Response from Gemini:");
    console.log(text);
    console.log("\n🎉 Your API key is valid and ready to use!");
    console.log("\n📋 Next steps:");
    console.log("1. Add your API key to .env.local file:");
    console.log("   GOOGLE_GENERATIVE_AI_API_KEY=" + API_KEY.substring(0, 10) + "...");
    console.log("2. Restart your Next.js dev server");
    console.log("3. Try uploading a plant image!");

  } catch (error) {
    console.error("❌ ERROR:", error.message);
    console.log("\n🔍 Troubleshooting:");
    
    if (error.message.includes("API_KEY_INVALID")) {
      console.log("- Your API key is invalid");
      console.log("- Get a new one from: https://makersuite.google.com/app/apikey");
    } else if (error.message.includes("404")) {
      console.log("- Model not found or not accessible");
      console.log("- Make sure your API key has access to Gemini models");
    } else if (error.message.includes("PERMISSION_DENIED")) {
      console.log("- Your API key doesn't have permission");
      console.log("- Check your Google Cloud project settings");
    } else {
      console.log("- Check your internet connection");
      console.log("- Verify your API key is correct");
      console.log("- Visit: https://makersuite.google.com/app/apikey");
    }
  }
}

testGeminiAPI();
