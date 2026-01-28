# SideQuest 🎮💰

**Your next money quest starts here**

SideQuest is an AI-powered mobile application that helps Gen Z discover and pursue personalized side hustles. Instead of overwhelming users with generic "make money online" lists, SideQuest uses Claude AI to analyze each user's unique skills, available time, resources, and goals to provide tailored side hustle recommendations called "quests."

## 🎯 Features

- **AI-Powered Matching**: Personalized quest recommendations using Claude AI
- **Gaming-Inspired UX**: Gamified experience with progress tracking and achievements
- **Action-Oriented Guides**: Step-by-step action plans for each quest
- **Progress Tracking**: Track your earnings and quest completion
- **Beautiful Design**: Modern UI with vibrant gradients and smooth animations

## 🚀 Tech Stack

- **Frontend**: React Native + Expo (TypeScript)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **AI**: Claude Sonnet 4.5 via Anthropic API
- **State Management**: Zustand
- **Animations**: Reanimated 3 + Moti
- **Navigation**: React Navigation

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd SideQuest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials
   - Add your Anthropic API key
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   EXPO_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL script in `supabase/schema.sql` in your Supabase SQL Editor
   - This will create all necessary tables and security policies

5. **Start the development server**
   ```bash
   npx expo start
   ```

6. **Run on device**
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or press `a` for Android emulator, `i` for iOS simulator

## 📱 Project Structure

```
SideQuest/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── ui/          # Base UI components (Button, Input, Card, etc.)
│   ├── config/          # Configuration files (Supabase, Anthropic)
│   ├── constants/       # Theme constants and design tokens
│   ├── navigation/      # React Navigation setup
│   ├── screens/         # App screens
│   │   └── onboarding/  # Onboarding flow screens
│   ├── services/        # API services and business logic
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── supabase/            # Database schema and migrations
├── assets/              # Images, fonts, and other static assets
└── App.tsx              # Main app entry point
```

## 🎨 Design System

### Colors
- **Quest Green**: `#00FF87` - Primary CTA, success states
- **Quest Purple**: `#6B48FF` - Headers, emphasis, premium
- **Gold Reward**: `#FFD700` - Achievements, rewards
- **Dark Background**: `#0A0E27` - App background
- **Card Background**: `#1A1F3A` - Quest cards, containers

### Typography
- **Primary Font**: Inter (headers, body text)
- **Secondary Font**: Space Grotesk (numbers, statistics)

## 🔑 Getting API Keys

### Supabase
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > API
4. Copy your project URL and anon/public key

### Anthropic (Claude AI)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account
3. Generate an API key
4. Add credits to your account

## 🚧 Development Roadmap

### ✅ Phase 1: Project Setup (Current)
- [x] Initialize React Native + Expo project
- [x] Configure NativeWind and Tailwind
- [x] Set up Supabase and Anthropic
- [x] Create database schema
- [x] Design system and constants

### 🔨 Phase 2: Core Features (Next)
- [ ] Authentication screens (Login/Signup)
- [ ] Onboarding flow
- [ ] AI quest generation service
- [ ] Quest discovery UI
- [ ] Home screen with active quests

### 🎯 Phase 3: Advanced Features
- [ ] Progress tracking
- [ ] Earnings tracker
- [ ] User profile and settings
- [ ] Premium subscription (Stripe)
- [ ] AI consultation chat

## 📄 License

This project is for educational and personal use.

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

## 📞 Support

For questions or issues, please refer to the master plan documentation in `/ref/SideQuest Master Plan.txt`

---

Built with ❤️ for Gen Z hustlers
