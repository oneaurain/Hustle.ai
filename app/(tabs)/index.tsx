import { notificationService } from '@/src/services/notificationService';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuestCard } from '@/src/components/QuestCard';
import { StatDetailModal } from '@/src/components/StatDetailModal';
import { ActivityChart } from '@/src/components/analytics/ActivityChart';
import { LevelProgress } from '@/src/components/gamification/LevelProgress';
import { StreakCounter } from '@/src/components/gamification/StreakCounter';
import { Button } from '@/src/components/ui/Button';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SHADOWS, SPACING } from '@/src/constants/theme';
import { useAuthStore } from '@/src/store/authStore';
import { useQuestStore } from '@/src/store/questStore';

interface StatModalData {
  title: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  description: string;
  trend?: string;
  history?: { label: string; value: string }[];
}

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { activeQuests, completedQuests, isLoading } = useQuestStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStat, setSelectedStat] = useState<StatModalData | null>(null);

  // Calculate earnings from completed quests
  const completedEarningsDetails = completedQuests.map(q => {
    // Assuming accurate earnings are being tracked, otherwise use min potential as estimate
    const amount = q.custom_data.earningsPotential?.min || 0;
    return {
      label: q.custom_data.title,
      value: `+$${amount}`,
      date: q.completed_at ? new Date(q.completed_at) : new Date(),
      amount: amount
    };
  }).sort((a, b) => b.date.getTime() - a.date.getTime());

  const totalEarnings = completedEarningsDetails.reduce((sum, item) => sum + item.amount, 0);

  // Calculate this week's trend
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyEarnings = completedEarningsDetails
    .filter(item => item.date >= oneWeekAgo)
    .reduce((sum, item) => sum + item.amount, 0);

  const activeQuestCount = activeQuests.length;

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate fetch
    setTimeout(() => setRefreshing(false), 1500);
  };

  useEffect(() => {
    // Check permissions and schedule nudge on mount
    const setupNotifications = async () => {
      const hasPermission = await notificationService.requestPermissions();
      if (hasPermission) {
        await notificationService.scheduleSmartNudge();
      }
    };
    setupNotifications();
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return 'Good night';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Animated Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.greeting}>{getTimeBasedGreeting()},</Text>
              <StreakCounter />
            </View>
            <Text style={styles.username}>
              {user?.email?.split('@')[0] || 'Partner'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.proButton}
            onPress={() => router.push('/(tabs)/membership')}
            activeOpacity={0.8}
          >
            <Feather name="zap" size={16} color={COLORS.textInverse} />
            <Text style={styles.proButtonText}>PRO</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.md }}>
          <LevelProgress />
        </View>

        {/* Consistency Tracker */}
        <View style={{ paddingHorizontal: SPACING.lg }}>
          <ActivityChart />
        </View>

        {/* Stats Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => setSelectedStat({
              title: 'Total Earnings',
              value: `$${totalEarnings}`,
              icon: 'dollar-sign',
              color: COLORS.success,
              description: 'Your total accumulated earnings from completed quests. Keep hustling!',
              trend: `+$${weeklyEarnings}`,
              history: completedEarningsDetails.length > 0 ? completedEarningsDetails.slice(0, 5) : undefined
            })}
          >
            <View style={styles.statIconBg}>
              <Feather name="dollar-sign" size={20} color={COLORS.success} />
            </View>
            <View>
              <Text style={styles.statValue}>${totalEarnings}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => setSelectedStat({
              title: 'Active Quests',
              value: activeQuestCount.toString(),
              icon: 'activity',
              color: COLORS.info,
              description: 'Quests you are currently working on. Complete them to earn rewards!',
              history: activeQuests.slice(0, 3).map(q => ({
                label: q.custom_data.title,
                value: 'In Progress'
              }))
            })}
          >
            <View style={[styles.statIconBg, { backgroundColor: `${COLORS.info}15` }]}>
              <Feather name="activity" size={20} color={COLORS.info} />
            </View>
            <View>
              <Text style={styles.statValue}>{activeQuestCount}</Text>
              <Text style={styles.statLabel}>Active Quests</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <StatDetailModal
          visible={!!selectedStat}
          onClose={() => setSelectedStat(null)}
          {...(selectedStat || {
            title: '',
            value: '',
            icon: 'activity',
            color: COLORS.primary,
            description: ''
          })}
        />

        {/* Active Quests Section */}
        <View style={styles.section}>
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Quests</Text>
            {activeQuests.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/(tabs)/discover')}>
                <Text style={styles.seeAllText}>Find More</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner size={40} color={COLORS.primary} />
            </View>
          ) : activeQuests.length > 0 ? (
            activeQuests.map((quest, index) => (
              <Animated.View
                key={quest.id}
                entering={FadeInDown.delay(400 + (index * 100)).duration(500)}
              >
                <QuestCard
                  quest={quest.custom_data}
                  showStatus
                  status={quest.status}
                  onPress={() => router.push({
                    pathname: '/quest/[id]',
                    params: { id: quest.id }
                  })}
                />
              </Animated.View>
            ))
          ) : (
            <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Feather name="compass" size={48} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No active quests</Text>
              <Text style={styles.emptyText}>
                Ready to make some extra cash? Discover your first side quest now.
              </Text>
              <Button
                title="Discover Quests"
                variant="primary"
                onPress={() => router.push('/(tabs)/discover')}
                style={styles.emptyButton}
                iconRight={<Feather name="arrow-right" size={18} color={COLORS.textInverse} />}
              />
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },
  scrollContent: {
    paddingBottom: SPACING['3xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  greeting: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  username: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  proButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    gap: 6,
    ...SHADOWS.sm,
  },
  proButtonText: {
    color: COLORS.textInverse,
    fontWeight: '700',
    fontSize: FONT_SIZES.xs,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    gap: SPACING.md,
    ...SHADOWS.sm,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.success}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderStyle: 'dashed',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  emptyButton: {
    minWidth: '100%',
  },
});
