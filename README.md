# 🌾 Crop Doctor AI - Smart Agriculture Disease Detection System

An AI-powered web application that helps farmers identify crop diseases instantly using image recognition, provides treatment recommendations, and suggests appropriate fertilizers with government-subsidized pricing.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-6.1-2D3748)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔬 AI-Powered Disease Detection
- **Instant Analysis**: Upload or capture crop images for immediate disease identification
- **Gemini 2.5 Flash AI**: Powered by Google's latest AI model for accurate detection
- **Detailed Reports**: Get comprehensive analysis including symptoms, severity, and confidence levels

### 🌱 Smart Fertilizer Recommendations
- **Automatic Suggestions**: Receive crop and disease-specific fertilizer recommendations
- **Government Pricing**: View both government-subsidized and market prices
- **Complete Information**: Dosage, application methods, benefits, and precautions
- **50+ Fertilizers**: Extensive database covering organic, chemical, and bio-fertilizers

### 🌍 Multi-Language Support
- **22 Indian Languages**: Hindi, Bengali, Telugu, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, and more
- **Voice Support**: Text-to-speech for accessibility
- **Farmer-Friendly**: Designed for users with varying literacy levels

### 📔 Farm Diary
- **Track Crops**: Maintain records of all your crops
- **Disease History**: Keep track of detected diseases and treatments
- **Activity Logs**: Record farming activities and observations
- **Offline Support**: Works without internet connection

### 🌤️ Weather Integration
- **Real-Time Weather**: Current weather conditions for your location
- **Location-Based**: Automatic GPS detection
- **Farming Insights**: Weather-based farming recommendations

### 🎨 Modern UI/UX
- **Agriculture Theme**: Beautiful green gradients with nature-inspired patterns
- **Dark Mode**: Professional dark theme for comfortable viewing
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **PWA Ready**: Install as a mobile app

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/crop-doctor-ai.git
cd crop-doctor-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
DATABASE_URL="file:./dev.db"
```

4. **Initialize the database**
```bash
npm run db:generate
npm run db:push
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3001
```

---

## 📱 Usage

### Analyze Crop Disease

1. **Upload Image**: Click "Open Camera" or "Browse Files"
2. **Wait for Analysis**: AI processes the image (2-4 seconds)
3. **View Results**: See disease identification, symptoms, and treatments
4. **Check Fertilizers**: Scroll down for recommended fertilizers with pricing
5. **Save to Diary**: Click "Save to Diary" to keep records

### View Farm Diary

1. Navigate to "Farm Diary" tab
2. Add crops with details (name, variety, area)
3. View detection history
4. Track disease occurrences

### Change Language

1. Click language selector at the top
2. Choose from 22 Indian languages
3. All content updates instantly

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 16.0**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS 4.0**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Lucide Icons**: Beautiful icon library

### Backend
- **Next.js API Routes**: Serverless functions
- **Prisma ORM**: Type-safe database access
- **SQLite**: Lightweight database (upgradeable to PostgreSQL)

### AI & APIs
- **Google Gemini 2.5 Flash**: Image analysis and disease detection
- **Open-Meteo API**: Weather data (free, no API key needed)

### Storage
- **Filesystem**: Images stored in `public/uploads/`
- **Database**: Complete detection records with metadata
- **IndexedDB**: Offline farm diary support

---

## 📂 Project Structure

```
crop-doctor-ai/
├── app/
│   ├── api/
│   │   ├── analyze-disease/      # Legacy endpoint
│   │   ├── upload-and-analyze/   # Main analysis endpoint
│   │   ├── detections/           # CRUD operations
│   │   ├── fertilizers/          # Fertilizer search
│   │   └── get-history/          # Detection history
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── disease-analysis.tsx      # Analysis results display
│   ├── farm-diary-page.tsx       # Farm diary interface
│   ├── image-upload-area.tsx     # Image upload component
│   ├── sidebar.tsx               # Navigation sidebar
│   └── ...                       # Other components
├── lib/
│   ├── fertilizer-recommendation-service.ts  # Fertilizer logic
│   ├── translations.ts           # Multi-language support
│   ├── auth-context.tsx          # Authentication
│   ├── prisma.ts                 # Database client
│   └── ...                       # Other utilities
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── dev.db                    # SQLite database
├── public/
│   └── uploads/                  # Stored images
├── .env.local                    # Environment variables
└── package.json                  # Dependencies
```

---

## 🗄️ Database Schema

### Detection Table
Stores all disease detection records:
- User information
- Image path and size
- Crop and disease details
- Severity and confidence
- Symptoms, treatments, prevention
- Fertilizer recommendations
- Location and weather data
- Timestamps

### User Table
Stores farmer profiles:
- Personal information
- Farm details (location, land size)
- Crop preferences
- Language preference

### Fertilizer Table
Fertilizer catalog:
- Name, type, NPK ratio
- Government and market prices
- Application details
- Benefits and precautions

---

## 🌱 Fertilizer Database

### Coverage
- **50+ Fertilizers**: Comprehensive database
- **3 Types**: Chemical, Organic, Bio-fertilizers
- **20+ Crops**: Major Indian crops covered
- **40+ Diseases**: Disease-specific recommendations

### Pricing
- Government subsidized prices (where applicable)
- Current market prices
- Unit specifications (per 50kg bag, per kg, etc.)

### Information Included
- NPK ratios
- Dosage per acre
- Application methods
- Frequency of application
- Benefits for crop health
- Safety precautions
- Availability status

---

## 🌍 Supported Languages

1. English (en)
2. Hindi (hi)
3. Bengali (bn)
4. Telugu (te)
5. Marathi (mr)
6. Tamil (ta)
7. Gujarati (gu)
8. Kannada (kn)
9. Malayalam (ml)
10. Punjabi (pa)
11. Odia (or)
12. Assamese (as)
13. Urdu (ur)
14. Kashmiri (ks)
15. Sindhi (sd)
16. Sanskrit (sa)
17. Nepali (ne)
18. Konkani (kok)
19. Manipuri (mni)
20. Dogri (doi)
21. Maithili (mai)
22. Santali (sat)
23. Bhojpuri (bh)

---

## 🔧 Configuration

### Environment Variables

```env
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Database (SQLite by default)
DATABASE_URL="file:./dev.db"

# For PostgreSQL (production)
# DATABASE_URL="postgresql://user:password@localhost:5432/cropdoctor"
```

### API Rate Limits (Free Tier)
- **Gemini 2.5 Flash**: 15 requests/minute, 1,500 requests/day
- **Open-Meteo**: Unlimited (free)

---

## 📊 API Endpoints

### POST /api/upload-and-analyze
Upload and analyze crop image

**Request:**
```typescript
FormData {
  image: File,
  userId: string,
  language: string
}
```

**Response:**
```json
{
  "disease": "Tomato Early Blight",
  "crop": "Tomato",
  "severity": "moderate",
  "confidence": "high",
  "symptoms": [...],
  "treatments": [...],
  "prevention": [...],
  "fertilizers": [...],
  "savedImagePath": "/uploads/detection_xxx.jpg",
  "detectionId": "clxxx..."
}
```

### GET /api/detections
Get detection history

**Query Parameters:**
- `userId`: Filter by user
- `crop`: Filter by crop
- `disease`: Filter by disease
- `limit`: Number of results (default: 50)

### GET /api/fertilizers
Search fertilizers

**Query Parameters:**
- `crop` + `disease`: Get recommendations
- `category`: Filter by category
- `query`: Search by name

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Add Environment Variables**
- Go to Vercel Dashboard
- Add `GOOGLE_GENERATIVE_AI_API_KEY`
- For production, use Vercel Postgres for `DATABASE_URL`

### Traditional Hosting

1. **Build**
```bash
npm run build
```

2. **Start**
```bash
npm start
```

3. **Requirements**
- Node.js 18+
- Environment variables set
- Database accessible
- Uploads folder writable

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI**: For powerful image analysis capabilities
- **Open-Meteo**: For free weather API
- **Vercel**: For excellent hosting platform
- **Radix UI**: For accessible components
- **Tailwind CSS**: For beautiful styling

---

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

## 🎯 Roadmap

### Upcoming Features
- [ ] Crop calendar and planting schedules
- [ ] Community forum for farmers
- [ ] Marketplace for buying fertilizers
- [ ] Expert consultation booking
- [ ] Pest identification
- [ ] Soil health analysis
- [ ] Yield prediction
- [ ] Government scheme information

---

## 📸 Screenshots

### Home Page
Beautiful agriculture-themed interface with easy image upload.

### Disease Analysis
Comprehensive disease information with AI-powered detection.

### Fertilizer Recommendations
Detailed fertilizer suggestions with government and market prices.

### Farm Diary
Track your crops and maintain farming records.

### Dark Mode
Professional dark theme for comfortable viewing.

---

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

Made with ❤️ for Indian Farmers 🌾
