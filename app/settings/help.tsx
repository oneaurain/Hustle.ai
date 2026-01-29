import { Button } from '@/src/components/ui/Button';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* -------------------------------------------------------------------------- */
/*                                  FAQ Data                                  */
/* -------------------------------------------------------------------------- */
const FAQS = [
    {
        id: '1',
        question: 'How do I start earning?',
        answer: 'Navigate to the "Discover" tab to find available side quests. Select a quest that interests you, follow the instructions, and submit your proof of work. Once verified, you earning will be credited to your account.'
    },
    {
        id: '2',
        question: 'When do I get paid?',
        answer: 'Payments are processed weekly every Friday for approved quests. You must have a minimum balance of $20 to request a payout.'
    },
    {
        id: '3',
        question: 'What is the "Hustle Pro" membership?',
        answer: 'Hustle Pro is our premium tier that unlocks unlimited AI quest generation, priority access to high-value gigs, and lower platform fees. You can upgrade from the Membership tab in your profile.'
    },
    {
        id: '4',
        question: 'How does the AI Coach work?',
        answer: 'Your AI Coach analyzes your skills and interests to generate personalized side hustle ideas and roadmaps. You can chat with it in the "Earn" tab to get advice and step-by-step guidance.'
    },
    {
        id: '5',
        question: 'Can I delete my account?',
        answer: 'Yes, you can request account deletion from the Settings page. Please note that this action is irreversible and all your data and earnings history will be lost.'
    }
];

/* -------------------------------------------------------------------------- */
/*                              Accordion Component                           */
/* -------------------------------------------------------------------------- */
const FAQItem = ({ item, isOpen, onPress }: { item: typeof FAQS[0], isOpen: boolean, onPress: () => void }) => {
    return (
        <View style={styles.faqItemContainer}>
            <Pressable onPress={onPress} style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Feather
                    name={isOpen ? "minus" : "plus"}
                    size={20}
                    color={isOpen ? COLORS.primary : COLORS.textSecondary}
                />
            </Pressable>
            {isOpen && (
                <MotiView
                    from={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ type: 'timing', duration: 300 }}
                    style={styles.faqContent}
                >
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
                </MotiView>
            )}
        </View>
    );
};

/* -------------------------------------------------------------------------- */
/*                              Main Screen Component                         */
/* -------------------------------------------------------------------------- */
export default function HelpSupportScreen() {
    const router = useRouter();
    const [openId, setOpenId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleItem = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    const handleContactSupport = async () => {
        const email = 'oneaura.in@gmail.com';
        const subject = 'Help Request';
        const gmailUrl = `googlegmail:///co?to=${email}&subject=${subject}`;
        const mailtoUrl = `mailto:${email}?subject=${subject}`;

        try {
            if (await Linking.canOpenURL(gmailUrl)) {
                await Linking.openURL(gmailUrl);
            } else {
                await Linking.openURL(mailtoUrl);
            }
        } catch (error) {
            console.error('Error opening email app:', error);
            // Fallback
            Linking.openURL(mailtoUrl);
        }
    };

    const filteredFaqs = FAQS.filter(f =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>How can we help?</Text>
                    <View style={styles.searchContainer}>
                        <Feather name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for answers..."
                            placeholderTextColor={COLORS.textMuted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* FAQ Section */}
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                <View style={styles.faqList}>
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map(item => (
                            <FAQItem
                                key={item.id}
                                item={item}
                                isOpen={openId === item.id}
                                onPress={() => toggleItem(item.id)}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No results found.</Text>
                        </View>
                    )}
                </View>

                {/* Contact Section */}
                <View style={styles.contactSection}>
                    <View style={styles.contactIconContainer}>
                        <Feather name="message-circle" size={32} color={COLORS.primary} />
                    </View>
                    <Text style={styles.contactTitle}>Still need help?</Text>
                    <Text style={styles.contactText}>
                        Our team is available 24/7 to assist you with any issues or questions.
                    </Text>
                    <Button
                        title="Contact Support"
                        onPress={handleContactSupport}
                        icon={<Feather name="mail" size={18} color={COLORS.textInverse} />}
                        fullWidth
                    />
                    <Text style={styles.supportEmailText}>or email us at oneaura.in@gmail.com</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.version}>App Version 1.0.0</Text>
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
    headerTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    content: {
        padding: SPACING.lg,
        paddingBottom: SPACING['3xl'],
    },
    heroSection: {
        marginBottom: SPACING.xl,
        marginTop: SPACING.sm,
    },
    heroTitle: {
        fontSize: FONT_SIZES['3xl'],
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS.lg,
        paddingHorizontal: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        height: 50,
    },
    searchIcon: {
        marginRight: SPACING.sm,
    },
    searchInput: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: FONT_SIZES.base,
        height: '100%',
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    faqList: {
        gap: SPACING.md,
        marginBottom: SPACING['2xl'],
    },
    faqItemContainer: {
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        overflow: 'hidden',
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
    },
    faqQuestion: {
        fontSize: FONT_SIZES.base,
        fontWeight: '600',
        color: COLORS.textPrimary,
        flex: 1,
        paddingRight: SPACING.md,
    },
    faqContent: {
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.md,
    },
    faqAnswer: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    emptyState: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    emptyStateText: {
        color: COLORS.textMuted,
        fontSize: FONT_SIZES.base,
    },
    contactSection: {
        backgroundColor: COLORS.surfaceBg,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    contactIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.cardBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    contactTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    contactText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
        lineHeight: 20,
    },
    supportEmailText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    footer: {
        alignItems: 'center',
    },
    version: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textMuted,
    },
});
