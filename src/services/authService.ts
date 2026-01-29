
import { User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

export const getCurrentUser = async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
};

export const signIn = async ({ email, password }: any) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data: data.user, error };
};

export const signUp = async ({ email, password, options }: any) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
    });
    return { data, error };
};

export const signInWithGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });

        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
};

export const signInAsGuest = async () => {
    // Guest logic is handled in store, strictly strictly client-side
    return { user: null, session: null, isGuest: true };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const signInWithOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
};

export const verifyOtp = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
    });
    if (error) throw error;
    return data;
};
