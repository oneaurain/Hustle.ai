import { AuthGate } from '@/src/components/auth/AuthGate';
import { AnimatedXPBadge } from '@/src/components/gamification/AnimatedXPBadge';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { sendChatMessage } from '@/src/services/aiService';
import { useGamificationStore } from '@/src/store/gamificationStore';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    xpGained?: number; // Visual flair
}

export default function GlobalChatScreen() {
    const params = useLocalSearchParams();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const { addXp } = useGamificationStore();

    // Parse context safely
    let context = "General Entrepreneurship";
    if (params.context) {
        try {
            context = typeof params.context === 'string' ? params.context : JSON.stringify(params.context);
        } catch (e) {
            console.log("Error parsing context params", e);
        }
    }

    // Initial greeting
    useEffect(() => {
        setMessages([{
            id: 'init',
            role: 'assistant',
            content: "Greetings, Traveler! 🧙 I am your Hustle Mentor. Ready to conquer your goals?",
            xpGained: 10
        }]);
    }, []);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userText = inputMessage.trim();
        const newUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: userText };

        setMessages(prev => [...prev, newUserMsg]);
        setInputMessage('');
        setIsLoading(true);

        // Scroll to bottom
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            history.push({ role: 'user', content: userText });

            const reply = await sendChatMessage(history, context);

            if (reply) {
                const xpAmount = 50;
                addXp(xpAmount); // Add real XP to store

                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: reply,
                    xpGained: xpAmount // Reward for engagement
                }]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    };

    const renderItem = ({ item }: { item: ChatMessage }) => {
        const isBot = item.role === 'assistant';
        return (
            <View style={[
                styles.messageRow,
                isBot ? styles.botRow : styles.userRow
            ]}>
                {isBot && (
                    <View style={styles.avatarContainer}>
                        <Image source={require('@/assets/comp.png')} style={styles.avatarImage} resizeMode="contain" />
                    </View>
                )}

                <View style={[
                    styles.messageBubble,
                    isBot ? styles.botBubble : styles.userBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isBot ? styles.botText : styles.userText
                    ]}>{item.content}</Text>

                    {item.xpGained && (
                        <AnimatedXPBadge amount={item.xpGained} />
                    )}
                </View>
            </View>
        );
    };



    return (
        <AuthGate
            title="Unlock Your AI Mentor"
            message="Chat with our advanced AI to get personalized advice, quest help, and more. Sign in to start your journey."
        >
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Quest Mentor</Text>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    style={styles.list}
                />

                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#000000ff" />
                        <Text style={styles.loadingText}>The Mentor is consulting the scrolls...</Text>
                    </View>
                )}

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                    style={styles.keyboardContainer}
                >
                    <View style={styles.footerContainer}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Type your query..."
                                placeholderTextColor={COLORS.textMuted}
                                value={inputMessage}
                                onChangeText={setInputMessage}
                                multiline
                            />
                            <TouchableOpacity
                                style={[styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled]}
                                onPress={handleSendMessage}
                                disabled={isLoading || !inputMessage.trim()}
                            >
                                <Feather name="send" size={20} color="#ffffffff" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.disclaimerText}>Hustle.ai can make mistakes, so double check it</Text>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </AuthGate>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBg,
    },
    keyboardContainer: {
        backgroundColor: COLORS.darkBg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderColor,
        backgroundColor: COLORS.cardBg,
    },
    headerTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        fontFamily: 'GravitasOne_400Regular',
    },
    list: {
        flex: 1,
    },
    listContent: {
        padding: SPACING.md,
        paddingBottom: SPACING.xl,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    botRow: {
        justifyContent: 'flex-start',
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    avatarContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(121, 121, 121, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#000000ff',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 16,
        borderRadius: 16,
        position: 'relative',
    },
    botBubble: {
        backgroundColor: COLORS.cardBg,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    userBubble: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: FONT_SIZES.base,
        lineHeight: 22,
    },
    botText: {
        color: COLORS.textPrimary,
    },
    userText: {
        color: COLORS.textInverse,
    },
    xpBadge: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#ffffffff',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        transform: [{ rotate: '5deg' }],
        shadowColor: '#070000ff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    xpText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#912e2eff',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: SPACING.lg,
        gap: 8,
    },
    loadingText: {
        color: '#000000ff', // Neon Green
        fontSize: FONT_SIZES.sm,
        fontStyle: 'italic',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderColor,
        backgroundColor: COLORS.cardBg,
        gap: SPACING.sm,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.darkBg, // Contrast against cardBg wrapper
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        paddingHorizontal: SPACING.md,
        paddingVertical: 12, // Taller touch target
        maxHeight: 100,
        color: COLORS.textPrimary,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#000000ff', // Neon Green
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    sendButtonDisabled: {
        backgroundColor: '#000000', // Keep it black even when disabled
        opacity: 0.5,
    },
    footerContainer: {
        backgroundColor: COLORS.cardBg,
        paddingBottom: Platform.OS === 'ios' ? 0 : SPACING.sm, // Adjust based on SafeArea edges if needed, but wrapper handles it usually
    },
    disclaimerText: {
        textAlign: 'center',
        color: COLORS.textMuted,
        fontSize: 10,
        paddingBottom: SPACING.sm,
        marginTop: -SPACING.xs,
    },
    avatarImage: {
        width: 34,
        height: 34,
        borderRadius: 112,
    },
});
