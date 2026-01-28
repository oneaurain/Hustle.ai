import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const QUESTIONS = [
    {
        id: 'skills',
        question: 'What is your primary skill?',
        options: ['Writing', 'Design', 'Development', 'Marketing', 'Video Editing', 'Social Media'],
    },
    {
        id: 'time',
        question: 'How much time can you commit?',
        options: ['1-5 hours/week', '5-10 hours/week', '10-20 hours/week', '20+ hours/week'],
    },
    {
        id: 'budget',
        question: 'What is your starting budget?',
        options: ['$0 (Free)', '$50-100', '$100-500', '$500+'],
    },
    {
        id: 'goal',
        question: 'What is your main goal?',
        options: ['Extra Pocket Money', 'Replace Full-time Job', 'Gain Experience', 'Passive Income'],
    },
];

export default function GenerateIdeasScreen() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [otherText, setOtherText] = useState('');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const currentQuestion = QUESTIONS[step];
    const isOtherSelected = selectedOption === 'Other';

    const handleOptionSelect = (option: string) => {
        if (option === 'Other') {
            setSelectedOption('Other');
            setOtherText('');
        } else {
            setSelectedOption(option);
            setAnswers({ ...answers, [currentQuestion.id]: option });
        }
    };

    const handleNext = () => {
        if (isOtherSelected) {
            setAnswers({ ...answers, [currentQuestion.id]: otherText });
        }

        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
            setSelectedOption(null);
            setOtherText('');
        } else {
            console.log('Final Answers:', answers);
            router.push('/earn/result');
        }
    };

    const isNextDisabled = !selectedOption || (isOtherSelected && !otherText.trim());

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${((step + 1) / QUESTIONS.length) * 100}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.stepText}>Question {step + 1} of {QUESTIONS.length}</Text>
                    <Text style={styles.questionText}>{currentQuestion.question}</Text>
                </View>

                <View style={styles.optionsContainer}>
                    {currentQuestion.options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.optionCard,
                                answers[currentQuestion.id] === option && !isOtherSelected && styles.optionSelected,
                                selectedOption === option && styles.optionSelected,
                            ]}
                            onPress={() => handleOptionSelect(option)}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    (selectedOption === option) && styles.optionTextSelected
                                ]}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    {/* Other Option */}
                    <TouchableOpacity
                        style={[
                            styles.optionCard,
                            isOtherSelected && styles.optionSelected
                        ]}
                        onPress={() => handleOptionSelect('Other')}
                    >
                        <Text style={[
                            styles.optionText,
                            isOtherSelected && styles.optionTextSelected
                        ]}>
                            Other
                        </Text>
                    </TouchableOpacity>

                    {isOtherSelected && (
                        <View style={styles.otherInputContainer}>
                            <Input
                                placeholder="Type your answer here..."
                                value={otherText}
                                onChangeText={setOtherText}
                                autoFocus
                            />
                        </View>
                    )}
                </View>

                <View style={styles.footer}>
                    <Button
                        title={step === QUESTIONS.length - 1 ? "Generate Ideas" : "Next"}
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={handleNext}
                        disabled={isNextDisabled}
                    />
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
        padding: SPACING.lg,
        paddingBottom: 40,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    progressBar: {
        height: 6,
        backgroundColor: COLORS.borderColor,
        borderRadius: 3,
        marginBottom: SPACING.md,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    stepText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
        fontWeight: '600',
    },
    questionText: {
        fontSize: FONT_SIZES['2xl'],
        color: COLORS.textPrimary,
        fontFamily: 'GravitasOne_400Regular',
        lineHeight: 34,
    },
    optionsContainer: {
        gap: SPACING.md,
    },
    optionCard: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.borderColor,
    },
    optionSelected: {
        borderColor: COLORS.primary,
        backgroundColor: '#F0F9FF', // Light blue tint
    },
    optionText: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textPrimary,
        fontWeight: '500',
        textAlign: 'center',
    },
    optionTextSelected: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    otherInputContainer: {
        marginTop: SPACING.sm,
    },
    footer: {
        marginTop: SPACING['2xl'],
    },
});
