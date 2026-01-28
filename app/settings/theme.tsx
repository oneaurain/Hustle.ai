import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ThemeSettingsScreen() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    const ThemeOption = ({ label, value, icon }: { label: string, value: 'light' | 'dark' | 'oled', icon: keyof typeof Feather.glyphMap }) => (
        <TouchableOpacity
            style={[
                styles.option,
                theme === value && styles.optionSelected
            ]}
            onPress={() => setTheme(value)}
        >
            <View style={styles.optionLeft}>
                <View style={[styles.iconContainer, theme === value && styles.iconActive]}>
                    <Feather name={icon} size={20} color={theme === value ? COLORS.textInverse : COLORS.textPrimary} />
                </View>
                <Text style={[styles.optionLabel, theme === value && styles.labelActive]}>{label}</Text>
            </View>
            {theme === value && (
                <Feather name="check" size={20} color={COLORS.primary} />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Appearance</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Select Theme</Text>
                <View style={styles.section}>
                    <ThemeOption label="Light Mode" value="light" icon="sun" />
                    <ThemeOption label="Dark Mode" value="dark" icon="moon" />
                    <ThemeOption label="OLED / Midnight" value="oled" icon="monitor" />
                </View>

                <View style={styles.preview}>
                    <Text style={styles.previewText}>
                        "The best way to predict the future is to create it."
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderColor,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    content: {
        padding: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '600',
    },
    section: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        marginBottom: SPACING.xl,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surfaceBg,
    },
    optionSelected: {
        backgroundColor: `${COLORS.primary}10`,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.surfaceBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconActive: {
        backgroundColor: COLORS.primary,
    },
    optionLabel: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    labelActive: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    preview: {
        padding: SPACING.xl,
        backgroundColor: COLORS.cardBg,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        borderStyle: 'dashed',
    },
    previewText: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textPrimary,
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: 'SpaceGrotesk_700Bold',
    },
});
