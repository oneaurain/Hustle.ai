import { FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useGamificationStore } from '@/src/store/gamificationStore';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const LevelUpModal = () => {
    const { level } = useGamificationStore();
    const [visible, setVisible] = useState(false);
    const prevLevelRef = useRef(level);

    useEffect(() => {
        if (level > prevLevelRef.current) {
            setVisible(true);
        }
        prevLevelRef.current = level;
    }, [level]);

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        {/* Static Black Icon */}
                        <Feather name="zap" size={64} color="#000000" />
                    </View>

                    <Text style={styles.title}>LEVEL UP</Text>

                    <Text style={styles.levelText}>{level}</Text>
                    <Text style={styles.subtitle}>Keep Hustling.</Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setVisible(false)}
                    >
                        <Text style={styles.buttonText}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.9)', // High opacity white overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        width: '80%',
        padding: SPACING.xl,
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#000000', // Thick Black Border
        borderRadius: 0, // Sharp corners for brutalist/minimal look
        elevation: 0, // Flat
        shadowOpacity: 0,
    },
    iconContainer: {
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES['3xl'],
        fontWeight: '900',
        color: '#000000',
        fontFamily: 'GravitasOne_400Regular',
        marginBottom: SPACING.sm,
        letterSpacing: 2,
    },
    levelText: {
        fontSize: 80,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        marginBottom: SPACING.sm,
        fontFamily: 'Courier New', // Monospace for raw feel
    },
    subtitle: {
        fontSize: FONT_SIZES.lg,
        color: '#000000',
        marginBottom: SPACING.xl,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    button: {
        backgroundColor: '#000000',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        width: '100%',
        alignItems: 'center',
        borderRadius: 0, // Square button
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: FONT_SIZES.lg,
        letterSpacing: 1,
    },
});
