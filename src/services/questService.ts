import { GROQ_API_URL, GROQ_MODEL, getGroqHeaders } from '../config/groq';
import localJobs from '../data/jobs.json';
import { OnboardingData, QuestData } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

// Helper to filter local jobs based on user profile
const getLocalRecommendations = (userProfile: OnboardingData): QuestData[] => {
    // 1. Filter by available time
    let recommended = localJobs.filter(job => {
        return job.min_time_hours <= userProfile.available_hours_per_week;
    });

    // 2. Score by skills match
    recommended = recommended.map(job => {
        const matchingSkills = job.skills.filter(skill =>
            userProfile.skills.some(userSkill =>
                userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(userSkill.toLowerCase())
            )
        );
        return { ...job, matchScore: matchingSkills.length };
    }).sort((a, b) => (b as any).matchScore - (a as any).matchScore);

    // 3. Transform to QuestData format
    return recommended.slice(0, 3).map(job => ({
        title: job.title,
        icon: 'briefcase',
        shortDescription: job.description,
        fullDescription: `${job.description}\n\nKey Skills: ${job.skills.join(', ')}`,
        category: job.category as any,
        earningsPotential: {
            min: job.earnings_min,
            max: job.earnings_max
        },
        timeToFirstDollar: job.max_time_hours,
        difficulty: job.difficulty as any,
        startupCost: 0,
        whyMatch: "Based on your matching skills and time availability.",
        actionSteps: job.action_steps,
        requiredSkills: job.skills,
        requiredResources: ["Computer", "Internet"],
        platforms: ["Upwork", "Fiverr"],
    }));
};

/**
 * Build the prompt for LLM based on master plan specifications
 */
function buildQuestPrompt(profile: OnboardingData): string {
    const skills = profile.skills.length > 0 ? profile.skills.join(', ') : "General, Motivation, Fast Learner";
    const interests = profile.interests.length > 0 ? profile.interests.join(', ') : "Making Money, Flexibility, Remote Work";
    const goals = profile.goals.length > 0 ? profile.goals.join(', ') : "Earn Extra Income";
    const time = profile.available_hours_per_week || 10;

    // Diversity Injector: Randomly pick 3 distinct niches to force variety
    const niches = [
        "Local Service", "Digital Freelancing", "Content Creation",
        "Re-selling/Flipping", "Gig Economy", "Teaching/Coaching",
        "Handmade Crafts", "Tech Support", "Event Planning",
        "Virtual Assistance", "Pet Care", "Home Organization",
        "Consulting", "Affiliate Marketing", "User Testing"
    ];
    // Shuffle and pick 3
    const selectedNiches = niches.sort(() => 0.5 - Math.random()).slice(0, 3).join(', ');

    return `
    Suggest 3 UNIQUE and distinct side hustles for a user with these stats.
    IMPORTANT: To ensure variety, focus specifically on these 3 niches: ${selectedNiches}.
    
    User Profile:
    - Skills: ${skills}
    - Available Time: ${time} hours/week
    - Interests: ${interests}
    - Goals: ${goals}
    
    Output strictly a JSON array of objects with this schema:
    [{
      "title": "string",
      "icon": "briefcase",
      "shortDescription": "string (1 sentence)",
      "fullDescription": "string",
      "category": "string (one of: Content Creation, Freelancing, E-commerce, Services, Teaching, Tech, Creative)",
      "earningsPotential": { "min": number, "max": number },
      "timeToFirstDollar": number,
      "difficulty": number (1-5),
      "startupCost": number,
      "whyMatch": "string",
      "actionSteps": ["string", "string"],
      "requiredSkills": ["string"],
      "requiredResources": ["string"],
      "platforms": ["string"]
    }]
    `;
}

/**
 * Generate personalized quest recommendations using Groq API
 */
export async function generateQuests(userProfile: OnboardingData): Promise<QuestData[]> {
    if (!API_KEY) {
        console.warn('Groq API not configured, using fallback quests');
        return getLocalRecommendations(userProfile);
    }

    try {
        const prompt = buildQuestPrompt(userProfile);
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: getGroqHeaders(API_KEY),
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    {
                        role: "system",
                        content: "You are an AI career coach specializing in side hustles. You MUST output strictly valid JSON array only. No markdown formatting, no explanation."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Groq API Error:', response.status, response.statusText, JSON.stringify(data));
            return getLocalRecommendations(userProfile);
        }

        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            console.error('Groq API returned no content:', JSON.stringify(data));
            return getLocalRecommendations(userProfile);
        }

        const cleanedText = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedText);

        if (Array.isArray(parsed)) {
            return parsed as QuestData[];
        } else if (typeof parsed === 'object' && parsed !== null) {
            // Handle wrapped arrays commonly returned by Llama models
            const possibleKeys = ['sideHustles', 'side_hustles', 'quests', 'recommendations', 'data'];
            for (const key of possibleKeys) {
                if (Array.isArray(parsed[key])) {
                    return parsed[key] as QuestData[];
                }
            }

            console.error('Groq returned object without known array key:', JSON.stringify(parsed));
            return getLocalRecommendations(userProfile);
        } else {
            console.error('Groq returned unknown format:', parsed);
            return getLocalRecommendations(userProfile);
        }
    } catch (error) {
        console.error('Error generating quests with AI:', error);
        console.log('Falling back to local database...');
        return getLocalRecommendations(userProfile);
    }
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
/**
 * Generate a single custom quest based on user request (premium feature)
 */
export async function generateCustomQuest(
    userProfile: OnboardingData,
    questIdea: string
): Promise<QuestData | null> {
    if (!API_KEY) {
        // Return first local match or null if no key
        const local = getLocalRecommendations(userProfile);
        return local.length > 0 ? local[0] : null;
    }

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: getGroqHeaders(API_KEY),
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    {
                        role: "system",
                        content: "You are an expert side hustle coach. Output strictly valid JSON object only."
                    },
                    {
                        role: "user",
                        content: `Create a specific side hustle quest about "${questIdea}" for this user profile: ${JSON.stringify(userProfile)}. 
                        Schema: Same as main generation but return a SINGLE object, not an array. Output valid JSON only.`
                    }
                ]
            })
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) return null;

        const cleanedText = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText) as QuestData;
    } catch (error) {
        console.error('Error generating custom quest:', error);
        // Fallback to first local recommendation
        const local = getLocalRecommendations(userProfile);
        return local.length > 0 ? local[0] : null;
    }
}
