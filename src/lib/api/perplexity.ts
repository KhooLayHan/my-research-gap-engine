import { PerplexityAPIResponse, PerplexityMessage } from "@/lib/types";

// Base URL for the Perplexity Sonar API
const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

// API Key for the Perplexity Sonar API
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

type PerplexitySearchModel = 'sonar' | 'sonar-pro';
type PerplexityResearchModel = 'sonar-deep-research';
type PerplexityReasoningModel = 'sonar-reasoning' | 'sonar-reasoning-pro';
type PerplexityOfflineModel = 'r1-1776';

type PerplexityModel = PerplexitySearchModel | PerplexityResearchModel | PerplexityReasoningModel | PerplexityOfflineModel;

/**
 * Calls the Perplexity Sonar API to get a chat completion.
 * 
 * @param messages - An array of messages representing the conversation history.
 * @param model - The Perplexity model to use.
 * @returns A Promise that resolves to the Perplexity API response.
 * @throws An error if the API key is missing or the API call fails.
 */
export async function getPerplexityCompletion(
  messages: PerplexityMessage[],
  model: PerplexityModel = 'sonar-pro' // Defaults to sonar-pro for better results
): Promise<PerplexityAPIResponse> {
  if (!PERPLEXITY_API_KEY) {
    throw new Error('PERPLEXITY_API_KEY is not configured. Please set PERPLEXITY_API_KEY in your .env.local file.');
  }
  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Accept': 'application/json', // Explicitly request JSON 
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        // Optional: Add more parameters as needed, e.g., stream: false, max_tokens, temperature, etc.
        // For hackathons, keeping it simple is good.
      })
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Perplexity API Error:', response.status, errorBody);
      throw new Error(`Perplexity API request failed with status ${response.status}: ${errorBody.message || JSON.stringify(errorBody)}`);
    }

    const data: PerplexityAPIResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Calling Perplexity API Error:', error);
    throw error;
  }
}