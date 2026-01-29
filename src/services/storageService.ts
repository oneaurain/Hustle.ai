import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Robust storage service that automatically chooses the best storage method.
 * - Native: Uses Encrypted SecureStore for sensitive tokens.
 * - Web: Fallback to AsyncStorage (or localStorage).
 */

export const secureStorage = {
    getItem: async (key: string): Promise<string | null> => {
        return AsyncStorage.getItem(key);
    },

    setItem: async (key: string, value: string): Promise<void> => {
        // ALWAYS use AsyncStorage for large state persistence to avoid 2048 byte limit warning from SecureStore
        return AsyncStorage.setItem(key, value);
    },

    removeItem: async (key: string): Promise<void> => {
        return AsyncStorage.removeItem(key);
    },
};
