import { GEMINI_MODEL, genAI, generationConfig, safetySettings } from '../config/gemini';

export interface RoadmapStep {
    week: string;
    focus: string;
    tasks: string[];
}

export interface RoadmapResponse {
    title: string;
    overview: string;
    timeline: RoadmapStep[];
}

/**
 * Generate a detailed roadmap for a specific business idea
 */
export async function generateRoadmap(idea: string): Promise<RoadmapResponse | null> {
    try {
        if (!genAI) {
            console.warn('Gemini API not configured');
            return null;
        }

        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            generationConfig,
            safetySettings,
        });

        const prompt = `You are an expert business consultant. Create a 4-8 week detailed launch roadmap for this side hustle idea: "${idea}".

        Return a JSON object with this exact structure:
        {
            "title": "Professional title for this project",
            "overview": "2 sentence summary of the strategy",
            "timeline": [
                {
                    "week": "Week 1",
                    "focus": "Main focus of the week (e.g., Market Research)",
                    "tasks": ["Specific actionable task 1", "Specific actionable task 2", "Specific actionable task 3"]
                }
            ]
        }

        CRITICAL: Return ONLY valid JSON. No markdown formatting.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        return JSON.parse(cleanedText) as RoadmapResponse;
    } catch (error) {
        console.error('Error generating roadmap:', error);
        return null;
    }
}
