import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface Props {
    amount: number;
}

export const AnimatedXPBadge: React.FC<Props> = ({ amount }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.5);

    useEffect(() => {
        // Reset (just in case)
        translateY.value = 0;
        opacity.value = 0;
        scale.value = 0.5;

        // Animate Scale In -> Float Up -> Fade Out
        scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.back(1.5)) });
        opacity.value = withSequence(
            withTiming(1, { duration: 200 }),
            withDelay(800, withTiming(0, { duration: 500 }))
        );
        translateY.value = withDelay(200, withTiming(-30, { duration: 1000, easing: Easing.out(Easing.quad) }));

    }, [amount]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateY.value },
                { scale: scale.value }
            ],
            opacity: opacity.value
        };
    });

    return (
        <Animated.View style={[styles.badge, animatedStyle]}>
            <Text style={styles.text}>+{amount} XP</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        top: -15, // Start slightly above the bubble
        right: -10,
        backgroundColor: '#FFD700', // Gold
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 100, // Ensure it floats on top
        borderWidth: 1,
        borderColor: '#FFF',
    },
    text: {
        fontSize: 12,
        fontWeight: '900',
        color: '#000',
    }
});
