import { GEMINI_MODEL, genAI, generationConfig, safetySettings } from '../config/gemini';
import { OnboardingData, QuestData } from '../types';

/**
 * Generate personalized quest recommendations using Gemini AI
 */
export async function generateQuests(
    userProfile: OnboardingData
): Promise<QuestData[]> {
    try {
        if (!genAI) {
            console.warn('Gemini API not configured, using fallback quests');
            return getFallbackQuests();
        }

        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            generationConfig,
            safetySettings,
        });

        const prompt = buildQuestPrompt(userProfile);

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean up the response - remove markdown code blocks if present
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse the JSON response
        const quests = JSON.parse(cleanedText) as QuestData[];

        // Validate we got an array
        if (!Array.isArray(quests)) {
            throw new Error('Invalid response format from AI');
        }

        return quests;
    } catch (error) {
        console.error('Error generating quests:', error);
        // Return fallback quests if AI fails
        return getFallbackQuests();
    }
}

/**
 * Build the prompt for Gemini AI based on master plan specifications
 */
function buildQuestPrompt(profile: OnboardingData): string {
    return `You are SideQuest AI, an expert side hustle advisor specifically for Gen Z (ages 18-25). Your goal is to suggest realistic, achievable side hustles that match the user's profile.

IMPORTANT GUIDELINES:
- Be realistic about earning potential (no "make $10k/month easily" promises)
- Focus on hustles that can actually start with their available resources
- Consider their time constraints seriously
- Match their skill level (don't suggest coding if they have no tech skills)
- Use Gen Z language (but stay professional)
- Prioritize hustles that can generate income within 1-4 weeks

USER PROFILE:
Skills: ${profile.skills.join(', ')}
Available Time: ${profile.available_hours_per_week} hours per week
Resources Available: ${profile.resources.join(', ')}
Primary Goals: ${profile.goals.join(', ')}
Interests: ${profile.interests.join(', ')}
Location Type: ${profile.location_type}

TASK: Generate exactly 5 personalized side hustle recommendations. Each recommendation must be formatted as a JSON object with these exact fields:

{
  "title": "Clear, catchy name for the hustle",
  "icon": "Single emoji representing the hustle",
  "shortDescription": "2-sentence hook (max 150 characters total)",
  "fullDescription": "3-4 detailed sentences explaining what this involves",
  "category": "Content Creation, Freelancing, E-commerce, Services, Teaching, Tech, or Creative",
  "earningsPotential": {
    "min": realistic monthly minimum in USD,
    "max": realistic monthly maximum in USD
  },
  "timeToFirstDollar": estimated hours until first payment (10-80 hours),
  "difficulty": integer 1-5 (1=very easy, 5=very hard),
  "startupCost": startup cost in USD (0-500),
  "whyMatch": "2 sentences explaining specifically why THIS hustle matches THEIR profile",
  "actionSteps": [
    "Step 1: Very specific, actionable first step",
    "Step 2: Next concrete action",
    "Step 3: Third step",
    "Step 4: Fourth step",
    "Step 5: Final step to start earning"
  ],
  "requiredSkills": ["skill1", "skill2"],
  "requiredResources": ["resource1", "resource2"],
  "platforms": ["Specific platform/website names"],
  "commonPitfalls": ["Pitfall 1", "Pitfall 2", "Pitfall 3"]
}

CRITICAL: Return ONLY valid JSON array format. No markdown, no code blocks, no explanations. Just the pure JSON array of 5 quests starting with [ and ending with ].`;
}

/**
 * Fallback quests if AI generation fails
 */
function getFallbackQuests(): QuestData[] {
    return [
        {
            title: 'Social Media Content Creation',
            icon: '📱',
            shortDescription: 'Create engaging content for brands on TikTok and Instagram',
            fullDescription: 'Help small businesses and personal brands create engaging short-form video content. You\'ll film, edit, and post content that drives engagement and grows their audience.',
            category: 'Content Creation',
            earningsPotential: { min: 200, max: 1500 },
            timeToFirstDollar: 20,
            difficulty: 2,
            startupCost: 0,
            whyMatch: 'Perfect for someone with social media skills and a smartphone',
            actionSteps: [
                'Create a portfolio with 3 sample videos showcasing different styles',
                'Join Fiverr and Upwork, set up professional profiles',
                'Reach out to 10 local small businesses offering a free trial video',
                'Deliver exceptional first projects to get testimonials',
                'Scale by raising prices and targeting bigger clients',
            ],
            requiredSkills: ['Video editing', 'Social media'],
            requiredResources: ['Smartphone', 'Basic editing app'],
            platforms: ['Fiverr', 'Upwork', 'Instagram'],
            commonPitfalls: [
                'Underpricing your services initially',
                'Not asking for testimonials',
                'Poor communication with clients',
            ],
        },
        {
            title: 'Freelance Writing',
            icon: '✍️',
            shortDescription: 'Write blog posts and articles for businesses and websites',
            fullDescription: 'Create written content for blogs, websites, and marketing materials. Topics range from tech to lifestyle depending on client needs.',
            category: 'Freelancing',
            earningsPotential: { min: 300, max: 2000 },
            timeToFirstDollar: 15,
            difficulty: 2,
            startupCost: 0,
            whyMatch: 'Great for someone with strong writing skills who can work flexible hours',
            actionSteps: [
                'Write 3 sample articles in different niches (save as portfolio)',
                'Create profiles on Fiverr, Upwork, and Contently',
                'Apply to 10-15 writing jobs per day for the first week',
                'Deliver first projects quickly with excellent quality',
                'Build long-term client relationships for recurring work',
            ],
            requiredSkills: ['Writing', 'Research'],
            requiredResources: ['Computer', 'Internet'],
            platforms: ['Fiverr', 'Upwork', 'Contently', 'Medium'],
            commonPitfalls: [
                'Not proofreading thoroughly',
                'Missing deadlines',
                'Not specializing in a profitable niche',
            ],
        },
        {
            title: 'Online Tutoring',
            icon: '📚',
            shortDescription: 'Teach students online in subjects you excel at',
            fullDescription: 'Share your knowledge by tutoring students online. Focus on subjects you\'re passionate about and help students improve their grades.',
            category: 'Teaching',
            earningsPotential: { min: 400, max: 2500 },
            timeToFirstDollar: 10,
            difficulty: 1,
            startupCost: 0,
            whyMatch: 'Ideal if you have expertise in a subject and enjoy teaching',
            actionSteps: [
                'Sign up on platforms like Chegg, Tutor.com, or Wyzant',
                'Complete platform verification and create your profile',
                'Set competitive rates based on your subject and experience',
                'Schedule your first few sessions and ask for reviews',
                'Build a regular client base through quality teaching',
            ],
            requiredSkills: ['Subject expertise', 'Communication'],
            requiredResources: ['Computer', 'Webcam', 'Stable internet'],
            platforms: ['Chegg', 'Tutor.com', 'Wyzant'],
            commonPitfalls: [
                'Not being patient with struggling students',
                'Poor time management',
                'Not adapting teaching style to different learners',
            ],
        },
    ];
}

/**
 * Generate a single custom quest based on user request (premium feature)
 */
export async function generateCustomQuest(
    userProfile: OnboardingData,
    questIdea: string
): Promise<QuestData | null> {
    try {
        if (!genAI) {
            return null;
        }

        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            generationConfig,
            safetySettings,
        });

        const prompt = `You are SideQuest AI. Based on this user profile and their quest idea, create ONE detailed, personalized quest recommendation.

USER PROFILE:
Skills: ${userProfile.skills.join(', ')}
Available Time: ${userProfile.available_hours_per_week} hours per week
Resources: ${userProfile.resources.join(', ')}
Goals: ${userProfile.goals.join(', ')}

QUEST IDEA: ${questIdea}

Return a single JSON object (not array) with the quest data matching the format from the main quest generation. Be specific, realistic, and actionable.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        return JSON.parse(cleanedText) as QuestData;
    } catch (error) {
        console.error('Error generating custom quest:', error);
        return null;
    }
}
