import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { useAnalyticsStore } from '@/src/store/analyticsStore';
import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export const ActivityChart: React.FC = () => {
    // Optimization: Select only the logs state to prevent re-renders from function/object creation
    const logs = useAnalyticsStore(state => state.logs);
    const { colors } = useTheme();

    // Calculate weekly data inside component to ensure stability
    const { labels, data } = useMemo(() => {
        const labels: string[] = [];
        const data: number[] = [];

        // Get last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

            labels.push(dayLabel);
            data.push(logs[dateStr]?.earnings || 0);
        }

        return { labels, data };
    }, [logs]);

    // Mock benchmark data for "Average Hustler"
    const benchmarkData = [10, 25, 15, 30, 45, 20, 35];

    const chartConfig = {
        backgroundGradientFrom: COLORS.cardBg,
        backgroundGradientTo: COLORS.cardBg,
        decimalPlaces: 0,
        color: (opacity = 1) => COLORS.primary,
        labelColor: (opacity = 1) => COLORS.textSecondary,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: colors.cardBg,
        },
        propsForBackgroundLines: {
            strokeDasharray: "4", // dashed lines
            stroke: colors.borderColor,
        }
    };

    const screenWidth = Dimensions.get("window").width;
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Consistency Tracker</Text>
                    <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.collapseButton}>
                        <Feather name={isCollapsed ? "chevron-down" : "chevron-up"} size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                {!isCollapsed && (
                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                            <Text style={[styles.legendText, { color: colors.textSecondary }]}>You</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.dot, { backgroundColor: colors.textMuted }]} />
                            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Avg. Hustler</Text>
                        </View>
                    </View>
                )}
            </View>

            {!isCollapsed && (
                <LineChart
                    data={{
                        labels: labels,
                        datasets: [
                            {
                                data: data,
                                color: (opacity = 1) => colors.primary, // User data
                                strokeWidth: 3
                            },
                            {
                                data: benchmarkData,
                                color: (opacity = 1) => colors.textMuted, // Benchmark
                                strokeWidth: 2,
                                withDots: false
                            }
                        ]
                    }}
                    width={screenWidth - (SPACING.lg * 2) - (SPACING.md * 2)} // Adjust for padding
                    height={220}
                    yAxisLabel="$"
                    yAxisSuffix=""
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withInnerLines={true}
                    withOuterLines={false}
                    withVerticalLines={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.md,
        borderColor: COLORS.borderColor,
        marginBottom: SPACING.xl,
        borderWidth: 2, // Thicker visible border
    },
    header: {
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.sm,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    title: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    legend: {
        flexDirection: 'row',
        gap: 12,
        marginTop: SPACING.xs,
    },
    collapseButton: {
        padding: 4,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
        paddingRight: 32, // Add padding for x-axis labels
    }
});
