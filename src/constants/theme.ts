/**
 * SideQuest Design System
 * Modern Clean Light Theme
 */

// Professional Light Theme Palette
export const LIGHT_THEME = {
    primary: '#0F172A',        // Slate 900
    secondary: '#334155',      // Slate 700
    accent: '#3B82F6',         // Bright Blue
    darkBg: '#FFFFFF',         // White
    cardBg: '#F8FAFC',         // Slate 50
    surfaceBg: '#F1F5F9',      // Slate 100
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',
    borderColor: '#E2E8F0',
    dividerColor: '#F1F5F9',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    questGreen: '#10B981',
};

// Enforced Light Theme (Aliases for safety)
export const DARK_THEME = LIGHT_THEME;
export const OLED_THEME = LIGHT_THEME;

export const COLORS = LIGHT_THEME; // Default export for backwards compatibility until Context is fully live

// Typography - Inter / System
export const FONTS = {
    primary: 'System',
    heading: 'System',
    decorative: 'GravitasOne_400Regular',
    mono: 'Courier New',
};

export const FONT_SIZES = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
} as const;

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
} as const;

export const BORDER_RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
} as const;

export const SHADOWS = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
} as const;
