import { GROQ_API_URL, GROQ_MODEL, getGroqHeaders } from '../config/groq';

const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

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
 * Generate a detailed roadmap for a specific business idea using Groq
 */
export async function generateRoadmap(idea: string): Promise<RoadmapResponse | null> {
    if (!API_KEY) {
        console.warn('Groq API not configured');
        return null;
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
                        content: "You are an expert business consultant. Output strictly valid JSON object only."
                    },
                    {
                        role: "user",
                        content: `Create a 4-8 week detailed launch roadmap for this side hustle idea: "${idea}".
                        
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
                        }`
                    }
                ]
            })
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) return null;

        const cleanedText = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText) as RoadmapResponse;
    } catch (error) {
        console.error('Error generating roadmap:', error);
        return null;
    }
}

/**
 * Chat with the AI Coach about the roadmap
 */
export async function sendChatMessage(history: { role: string, content: string }[], context: string): Promise<string | null> {
    if (!API_KEY) return "AI Service is offline. Please check your API key.";

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: getGroqHeaders(API_KEY),
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful Side Quest Coach. The user is asking about this roadmap: ${context}. Keep answers concise, encouraging, and actionable.`
                    },
                    ...history
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "I couldn't quite get that. Try again?";
    } catch (error) {
        console.error('Chat error:', error);
        return "Network error. Please try again.";
    }
}
