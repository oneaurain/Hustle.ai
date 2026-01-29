// User & Authentication Types
export interface User {
    id: string;
    email: string;
    subscription_tier: 'free' | 'premium';
    monthly_quest_count: number;
    onboarding_completed: boolean;
    referral_code?: string;
    referral_count?: number;
    referred_by?: string;
    created_at: string;
    updated_at: string;
}

export interface UserProfile {
    id: string;
    user_id: string;
    skills: string[];
    available_hours_per_week: number;
    resources: string[];
    goals: string[];
    interests: string[];
    location_type: string;
    created_at: string;
    updated_at: string;
}

// Quest Types
export interface Quest {
    id: string;
    user_id: string;
    status: 'suggested' | 'active' | 'completed' | 'archived';
    custom_data: QuestData;
    created_at: string;
    updated_at: string;
    started_at?: string;
    completed_at?: string;
}

export interface QuestData {
    title: string;
    icon: string;
    shortDescription: string;
    fullDescription: string;
    category: QuestCategory;
    earningsPotential: {
        min: number;
        max: number;
    };
    timeToFirstDollar: number;
    difficulty: 1 | 2 | 3 | 4 | 5;
    startupCost: number;
    whyMatch: string;
    actionSteps: string[];
    requiredSkills: string[];
    requiredResources: string[];
    platforms: string[];
    commonPitfalls?: string[];
    rarity?: 'common' | 'rare' | 'legendary';
    progress?: number;
    completedSteps?: number[];
    xp?: number;
}

export type QuestCategory =
    | 'Content Creation'
    | 'Freelancing'
    | 'E-commerce'
    | 'Services'
    | 'Teaching'
    | 'Tech'
    | 'Creative';

// Earnings Types
export interface Earning {
    id: string;
    user_id: string;
    quest_id: string;
    amount: number;
    date: string;
    notes?: string;
    created_at: string;
}

// Onboarding Types
export interface OnboardingData {
    skills: string[];
    available_hours_per_week: number;
    resources: string[];
    goals: string[];
    interests: string[];
    location_type: string;
}

// Navigation Types
export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Signup: undefined;
    OnboardingSkills: undefined;
    OnboardingTime: undefined;
    OnboardingResources: undefined;
    OnboardingGoals: undefined;
    MainTabs: undefined;
    QuestDetails: { questId: string };
    ActiveQuest: { questId: string };
};

export type MainTabParamList = {
    Home: undefined;
    Discover: undefined;
    Profile: undefined;
    Settings: undefined;
};

// API Response Types
export interface ApiResponse<T> {
    data?: T;
    error?: {
        message: string;
        code?: string;
    };
}

// Form Types
export interface LoginForm {
    email: string;
    password: string;
}

export interface SignupForm {
    email: string;
    password: string;
    confirmPassword: string;
}
