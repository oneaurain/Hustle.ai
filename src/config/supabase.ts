import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Only show warning in development
if (__DEV__ && (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY)) {
    console.warn('⚠️ Supabase credentials not configured. Please add them to .env file.');
    console.warn('The app will work in demo mode without backend features.');
}

import { secureStorage } from '@/src/services/storageService';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: secureStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
