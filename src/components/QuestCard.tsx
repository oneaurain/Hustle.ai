import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { Quest, QuestData } from '@/src/types';

interface QuestCardProps {
  quest: QuestData;
  onPress?: () => void;
  showStatus?: boolean;
  status?: Quest['status'];
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onPress,
  showStatus = false,
  status = 'suggested',
}) => {
  // Helper to get icon name based on category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'content creation': return 'video';
      case 'freelancing': return 'briefcase';
      case 'teaching': return 'book-open';
      case 'tech': return 'code';
      default: return 'activity';
    }
  };

  const difficultyStars = Array(quest.difficulty).fill(0).map((_, i) => (
    <Feather key={i} name="star" size={12} color={COLORS.warning} style={{ marginRight: 2 }} />
  ));

  const monthlyEarnings = `$${quest.earningsPotential.min}-$${quest.earningsPotential.max}/mo`;

  const getRarityStyle = () => {
    switch (quest.rarity) {
      case 'rare': return styles.rarityRare;
      case 'legendary': return styles.rarityLegendary;
      default: return styles.rarityCommon;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
      style={[styles.container, getRarityStyle()]}
    >
      {quest.rarity && quest.rarity !== 'common' && (
        <View style={[styles.rarityTag, {
          borderColor: quest.rarity === 'legendary' ? '#F59E0B' : '#3B82F6',
          backgroundColor: quest.rarity === 'legendary' ? '#FEF3C7' : '#EFF6FF'
        }]}>
          <Text style={[styles.rarityText, {
            color: quest.rarity === 'legendary' ? '#B45309' : '#1D4ED8'
          }]}>{quest.rarity}</Text>
        </View>
      )}
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Feather name={getCategoryIcon(quest.category)} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={2}>
            {quest.title}
          </Text>
          <Text style={styles.category}>{quest.category}</Text>
        </View>
        {showStatus && status !== 'suggested' && (
          <View style={[
            styles.statusBadge,
            status === 'completed' ? styles.statusCompleted : styles.statusActive
          ]}>
            <Text style={styles.statusText}>
              {status === 'completed' ? 'Done' : 'Active'}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {quest.shortDescription}
      </Text>

      {/* Specs Grid */}
      <View style={styles.specsGrid}>
        <View style={styles.specItem}>
          <Feather name="dollar-sign" size={14} color={COLORS.success} />
          <Text style={styles.specText}>{monthlyEarnings}</Text>
        </View>

        <View style={styles.specItem}>
          <Feather name="clock" size={14} color={COLORS.textSecondary} />
          <Text style={styles.specText}>{quest.timeToFirstDollar}h to 1st $</Text>
        </View>

        <View style={styles.specItem}>
          <View style={{ flexDirection: 'row' }}>{difficultyStars}</View>
        </View>
      </View>

      {/* Progress Bar (if active) */}
      {status === 'active' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '30%' }]} />
          </View>
          <Text style={styles.progressText}>30% Complete</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  category: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  statusActive: {
    backgroundColor: `${COLORS.info}20`,
  },
  statusCompleted: {
    backgroundColor: `${COLORS.success}20`,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  specsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.dividerColor,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.surfaceBg,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.info,
    borderRadius: BORDER_RADIUS.sm,
  },
  progressText: {
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  rarityCommon: {
    borderColor: COLORS.borderColor,
  },
  rarityRare: {
    borderColor: '#3B82F6', // Blue
    borderWidth: 2,
  },
  rarityLegendary: {
    borderColor: '#F59E0B', // Gold
    borderWidth: 2,
    backgroundColor: '#FFFBEB', // Light Gold
  },
  rarityTag: {
    position: 'absolute',
    top: -8,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
