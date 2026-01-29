import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useQuestStore } from '@/src/store/questStore';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const DAYS_TO_SHOW = 90; // Last 3 months
const SQUARE_SIZE = 12;
const GAP = 4;

interface DayContribution {
    date: string;
    count: number;
    label: string;
}

export const ConsistencyGraph: React.FC = () => { // Force rebuild
    const { completedQuests } = useQuestStore();

    // Generate contribution data
    const contributions = useMemo<DayContribution[]>(() => {
        const today = new Date();
        const data = new Map<string, number>();

        // Populate with completed quests
        completedQuests.forEach(q => {
            if (q.completed_at) {
                const dateStr = new Date(q.completed_at).toISOString().split('T')[0];
                data.set(dateStr, (data.get(dateStr) || 0) + 1);
            }
        });

        // Generate last N days array
        const days: DayContribution[] = [];
        for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            days.push({
                date: dateStr,
                count: data.get(dateStr) || 0,
                label: date.getDate().toString()
            });
        }
        return days;
    }, [completedQuests]);

    // Group into weeks for column layout
    const weeks = useMemo<DayContribution[][]>(() => {
        const result: DayContribution[][] = [];
        let currentWeek: DayContribution[] = [];

        contributions.forEach((day, index) => {
            currentWeek.push(day);
            if (currentWeek.length === 7 || index === contributions.length - 1) {
                result.push(currentWeek);
                currentWeek = [];
            }
        });
        return result;
    }, [contributions]);

    const getColor = (count: number) => {
        // High Contrast Palette
        if (count === 0) return '#CBD5E1'; // Slate 300 (Visible Grey) for empty
        if (count === 1) return '#93C5FD'; // Blue 300
        if (count === 2) return '#3B82F6'; // Blue 500
        return '#1E3A8A'; // Blue 900 (Darkest)
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Activity Graph</Text>
                <Text style={styles.subtitle}>Last 90 Days</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.grid}>
                {weeks.map((week, weekIndex) => (
                    <View key={weekIndex} style={styles.column}>
                        {week.map((day) => (
                            <View
                                key={day.date}
                                style={[
                                    styles.square,
                                    { backgroundColor: getColor(day.count) }
                                ]}
                            />
                        ))}
                    </View>
                ))}
            </ScrollView>

            <View style={styles.legend}>
                <Text style={styles.legendText}>Less</Text>
                <View style={[styles.legendSquare, { backgroundColor: '#CBD5E1' }]} />
                <View style={[styles.legendSquare, { backgroundColor: '#93C5FD' }]} />
                <View style={[styles.legendSquare, { backgroundColor: '#1E3A8A' }]} />
                <Text style={styles.legendText}>More</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F1F5F9', // Slate 100 (Subtle offset from white)
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        marginBottom: SPACING.lg
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md
    },
    title: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary
    },
    subtitle: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary
    },
    grid: {
        flexDirection: 'row',
        gap: GAP
    },
    column: {
        gap: GAP
    },
    square: {
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        borderRadius: 2
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 6,
        marginTop: SPACING.sm
    },
    legendSquare: {
        width: 10,
        height: 10,
        borderRadius: 2
    },
    legendText: {
        fontSize: 10,
        color: COLORS.textSecondary
    },
    graphContainer: {
        position: 'relative',
    },
    ghostOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(4px)', // Works on some platforms, falling back to opacity
    },
    ghostContent: {
        backgroundColor: COLORS.cardBg,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    ghostTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    ghostSubtitle: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
    }
});
