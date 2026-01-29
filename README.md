# Hustle.ai 🎮💰

**Your next money quest starts here**

Hustle.ai is an AI-powered mobile application that helps Gen Z discover and pursue personalized side hustles. Instead of overwhelming users with generic "make money online" lists, Hustle.ai uses advanced AI (Groq/Llama 3) to analyze each user's unique skills, available time, resources, and goals to provide tailored side hustle recommendations called "quests."

## 🎯 Features

- **AI-Powered Matching**: Personalized quest recommendations using Groq (Llama 3)
- **Gaming-Inspired UX**: Gamified experience with progress tracking, XP, and streaks
- **Action-Oriented Guides**: Step-by-step action plans for each quest
- **Monetization**:
  - **Premium Subscription**: Unlock exclusive quests and advanced features (Stripe)
  - **Rewards**: Watch ads to earn extra XP or unlock features (AdMob)
- **Progress Tracking**: Track your earnings and quest completion
- **Beautiful Design**: Modern UI with vibrant gradients and smooth animations

## 🚀 Tech Stack

- **Frontend**: React Native + Expo (TypeScript)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **AI**: Groq API (Llama 3-8b-8192)
- **Payments**: Stripe
- **Ads**: Google AdMob
- **State Management**: Zustand
- **Animations**: Reanimated 3 + Moti
- **Navigation**: Expo Router

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/oneaurain/Hustle.ai.git
   cd Hustle.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` (or create one)
   - Add your credentials:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   EXPO_PUBLIC_GROQ_API_KEY=your_groq_key
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   EXPO_PUBLIC_ADMOB_BANNER_ID=your_banner_id
   EXPO_PUBLIC_ADMOB_REWARDED_ID=your_rewarded_id
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

## 📱 Build & Deploy

### Generate APK (Android)
To generate an installable APK file instead of an AAB bundle:
```bash
eas build -p android --profile apk
```

### Production Build (AAB)
For Google Play Store submission:
```bash
eas build -p android --profile production
```

## 🎨 Design System

### Colors
- **Quest Green**: `#00FF87` - Primary CTA, success states
- **Quest Purple**: `#6B48FF` - Headers, emphasis, premium
- **Gold Reward**: `#FFD700` - Achievements, rewards
- **Dark Background**: `#0A0E27` - App background
- **Card Background**: `#1A1F3A` - Quest cards, containers

## 🔑 API Configuration

### Supabase
- Used for Authentication and Database.
- Tables: `profiles`, `quests`, `user_quests`.

### Groq (AI)
- Provides fast inference for quest generation and chat.
- Model: `llama3-8b-8192`.

### Stripe
- Handles subscription payments.
- Ensure you have a Merchant Identifier set up for Apple Pay if targeting iOS.

## 🚧 Roadmap

### ✅ Phase 1: Foundation
- [x] Project Setup & Architecture
- [x] UI/UX Design System
- [x] Authentication (Supabase)
- [x] Database Schema

### ✅ Phase 2: Core Features
- [x] Onboarding Flow
- [x] Home Dashboard
- [x] AI Quest Generation (Groq)
- [x] Quest Details & Acceptance
- [x] Profile & Settings

### ✅ Phase 3: Engagement & Monetization
- [x] Gamification (Streaks, XP)
- [x] Premium Subscriptions (Stripe)
- [x] Ad Integration (AdMob)
- [x] Referral System

### 🔜 Phase 4: Polish & Launch
- [ ] Push Notifications
- [ ] Analytics Integration
- [ ] Play Store Submission

## 📄 License

This project is for educational and personal use.

---

Built with ❤️ for Gen Z hustlers
