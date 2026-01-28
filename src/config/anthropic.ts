import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '';

if (!apiKey) {
    console.warn('Anthropic API key not found. Please set EXPO_PUBLIC_ANTHROPIC_API_KEY in .env file');
}

export const anthropic = new Anthropic({
    apiKey: apiKey,
});

export const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
export const MAX_TOKENS = 4096;
