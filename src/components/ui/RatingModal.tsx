import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useRatingStore } from '@/src/store/ratingStore';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const RatingModal = () => {
    const { visible, hideRating } = useRatingStore();
    const [rating, setRating] = useState(0);

    if (!visible) return null;

    const handleRate = (stars: number) => {
        setRating(stars);
    };

    const handleSubmit = () => {
        // Logic to submit rating would go here
        hideRating();
        // Reset after strict delay
        setTimeout(() => setRating(0), 500);
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={hideRating}
        >
            <View style={styles.overlay}>
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring' }}
                    style={styles.card}
                >
                    <Feather name="award" size={48} color={COLORS.primary} style={styles.icon} />

                    <Text style={styles.title}>Enjoying Hustle AI?</Text>
                    <Text style={styles.subtitle}>
                        We'd love to hear your feedback! Tap a star to rate us.
                    </Text>

                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => handleRate(star)}
                                activeOpacity={0.7}
                            >
                                <MotiView
                                    animate={{
                                        scale: star <= rating ? 1.2 : 1,
                                    }}
                                    transition={{ type: 'spring' }}
                                >
                                    <FontAwesome
                                        name={star <= rating ? "star" : "star-o"}
                                        size={36}
                                        color={star <= rating ? "#F59E0B" : "#E2E8F0"}
                                        style={styles.star}
                                    />
                                </MotiView>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity onPress={hideRating} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>No Thanks</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={[
                                styles.submitButton,
                                {
                                    opacity: rating > 0 ? 1 : 0.5,
                                }
                            ]}
                            disabled={rating === 0}
                        >
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </MotiView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', // Lighter backdrop
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF', // White Card
        width: '85%',
        borderRadius: 24,
        padding: SPACING.xl,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    icon: {
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 22,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.xl,
        gap: SPACING.sm,
    },
    star: {
        // No heavy text shadow for clean look
    },
    actions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: SPACING.md,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: SPACING.lg,
    },
    cancelText: {
        color: COLORS.textMuted,
        fontSize: FONT_SIZES.base,
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: COLORS.primary, // Dark Button on White
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 999,
        elevation: 2,
    },
    submitText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: FONT_SIZES.base,
    },
});
