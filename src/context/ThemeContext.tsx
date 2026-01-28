import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { DARK_THEME, LIGHT_THEME, OLED_THEME } from '../constants/theme';

type ThemeType = 'light' | 'dark' | 'oled';
type ThemeColors = typeof LIGHT_THEME;

interface ThemeContextProps {
    theme: ThemeType;
    colors: ThemeColors;
    setTheme: (theme: ThemeType) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
    theme: 'light',
    colors: LIGHT_THEME,
    setTheme: () => { },
    toggleTheme: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeType>('light');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('user_theme');
            if (savedTheme) {
                setThemeState(savedTheme as ThemeType);
            } else {
                // Default to system preference
                const colorScheme = Appearance.getColorScheme();
                setThemeState(colorScheme === 'dark' ? 'dark' : 'light');
            }
        } catch (error) {
            console.error('Failed to load theme:', error);
        }
    };

    const setTheme = async (newTheme: ThemeType) => {
        setThemeState(newTheme);
        try {
            await AsyncStorage.setItem('user_theme', newTheme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
    };

    const getThemeColors = () => {
        switch (theme) {
            case 'dark': return DARK_THEME;
            case 'oled': return OLED_THEME;
            default: return LIGHT_THEME;
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, colors: getThemeColors(), setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
