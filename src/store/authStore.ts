
import { supabase } from '@/src/config/supabase';
import { secureStorage } from '@/src/services/storageService';
import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isGuest: boolean;
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setGuest: (isGuest: boolean) => void;
    clearUser: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            session: null,
            isLoading: true,
            isGuest: false,
            setUser: (user) => set({ user, isGuest: false }),
            setSession: (session) => set({ session }),
            setGuest: (isGuest) => set({ isGuest, user: null, session: null }),
            clearUser: async () => {
                set({ isLoading: true });
                try {
                    await supabase.auth.signOut();
                    set({ user: null, session: null, isGuest: false });
                } catch (error) {
                    console.error("Sign out error:", error);
                } finally {
                    set({ isLoading: false });
                }
            },
            initialize: async () => {
                set({ isLoading: true });
                try {
                    // Check for existing session
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session) {
                        set({ session, user: session.user, isGuest: false });
                    }
                } catch (error) {
                    console.error("Auth init error:", error);
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => secureStorage),
            partialize: (state) => ({ user: state.user, session: state.session, isGuest: state.isGuest }),
        }
    )
);
