# Production & Deployment Prompts

Use these prompts one by one with your AI assistant (or me) to complete the final steps for **SideQuest** production launch.

## Phase 1: Backend Deployment (Render/Heroku)

> "Help me deploy my Node.js backend (in the `server/` folder) to a free hosting service like Render or Railway. Please provide a `render.yaml` or `Dockerfile` if needed, and explain how to add my Environment Variables (`STRIPE_SECRET`, `SUPABASE_KEY`, etc.) to the live server."

## Phase 2: Database Security (Supabase)

> "I need to secure my Supabase database for production. Please generate the SQL Row Level Security (RLS) policies for:
> 1. `users` table: Users can read/edit only their own profile.
> 2. `ad_stats` table: Users can insert views but cannot edit/delete them.
> 3. `transactions` table: Users can read their own history but cannot insert/fake payments."

## Phase 3: Privacy & Compliance

> "Generate a comprehensive Privacy Policy (Markdown format) for my app 'SideQuest'. It uses Google AdMob, Stripe for payments, and Supabase for auth/data. It collects email, user usage data for ads, and device ID. Also create a 'Delete Account' function that ensures all user data is wiped from Supabase via an Edge Function or API."

## Phase 4: App Icons & Splash Screen

> "My app.json currently uses default icons. I have a logo.png. Help me generate all the required icon sizes and splash screen assets for iOS and Android using `npx expo-image-utils` or a similar tool, and update my app.json config to point to them."

## Phase 5: Production Build (EAS)

> "I am ready to build the APK/AAB for the Play Store and IPA for the App Store. Guide me through setting up `eas.json` for a 'production' build profile. Explain how to run `eas build` and how to handle the signing credentials management."

## Phase 6: Store Listing Optimizations (ASO)

> "Write a compelling App Store description for 'SideQuest'.
> *   **Title:** SideQuest: AI Side Hustle Ideas
> *   **Subtitle:** Earn Money with AI Guidance
> *   **Keywords:** side hustle, make money, ai business, passive income, gig economy
> *   **Description:** Highlight features like personalized AI roadmap, step-by-step guides, progress tracking, and secure stripe payments."
