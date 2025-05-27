import { NextResponse } from 'next/server';

import { PerplexityAPIResponse, PerplexityMessage, PerplexityContentPart } from '@/lib/types';
import { getPerplexityCompletion } from '@/lib/api/perplexity';
import { searchInputSchema } from '@/lib/schemas/searchSchema';

// Helper function to robustly extract content from Perplexity's complex message structure
function extractPerplexityContent(response: PerplexityAPIResponse): string {
  if (response.choices && response.choices.length > 0 && response.choices[0].message) {
    const message = response.choices[0].message;

    if (typeof message.content === 'string') 
      return message.content;
    
    // Handle array content if Perplexity returns structured tool results
    if (Array.isArray(message.content)) {
      // Concatenate text parts
      return message.content
        .map((part: PerplexityContentPart) => {
          // Defensive checks: ensure part is an object, not null, and has a 'text' property that is a string
          if (typeof part === 'object' && part !== null && 'title' in part && typeof part.title === 'string') {
            return part.title;
          }
          return ''; // Return an empty string for any invalid or non-text parts
        })
        .filter(Boolean)
        .join('\n');
    }
  }
  return 'No detailed contents available.';
}

/**
 * Handles GET requests to the /api/generate-insights endpoint.
 * This endpoint regenerates and returns new insights and suggested questions for a given topic.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');

    // 1. Validate input using Zod
    const validationResult = searchInputSchema.safeParse({ topic });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid topic provided.', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const validatedTopic = validationResult.data.topic;

    // 2. Formulate the prompt to generate insights and questions
    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: `You are an expert research strategist. For the topic "${validatedTopic}", provide fresh, concise insights into potential research gaps and generate 5-7 highly impactful, novel research questions that address these gaps. Focus on interdisciplinary or overlooked aspects. Format your response clearly: first list insights with bullet points, then list questions with bullet points.`,
      },
      {
        role: 'user',
        content: `Generate new insights and research questions for "${validatedTopic}".`,
      },
    ];

    // 3. Call Perplexity Sonar API
    const perplexityResponse = await getPerplexityCompletion(messages, 'sonar'); // Using medium model for better quality output
    const rawPerplexityContent = extractPerplexityContent(perplexityResponse);

    // 4. Parse Perplexity's response to extract insights and questions
    const insights: string[] = [];
    const suggestedQuestions: string[] = [];

    let isParsingInsights = true;
    rawPerplexityContent.split('\n').forEach(line => {
      line = line.trim();
      if (!line) return; // Skip empty lines

      // Heuristic to switch from insights to questions. Look for common question phrases.
      if (line.toLowerCase().includes('research questions') || line.toLowerCase().includes('suggested questions')) {
        isParsingInsights = false;
        return;
      }

      // Check for bullet points or numbered lists
      const bulletMatch = line.match(/^[-*]\s*(.*)$/); // Matches "- " or "* "
      const numberMatch = line.match(/^\d+\.\s*(.*)$/); // Matches "1. "

      const content = bulletMatch ? bulletMatch[1].trim() : (numberMatch ? numberMatch[1].trim() : line.trim());

      if (content) {
        if (isParsingInsights) {
          insights.push(content);
        } else {
          suggestedQuestions.push(content);
        }
      }
    });

    // Basic fallback: if parsing didn't find anything, put raw content into a single insight/question
    if (insights.length === 0 && suggestedQuestions.length === 0 && rawPerplexityContent) {
        insights.push("Could not parse detailed insights, but here's a general output: " + rawPerplexityContent);
        suggestedQuestions.push("Consider exploring the general areas related to this topic.");
    }

    // 5. Return processed data to the frontend
    return NextResponse.json({ insights, suggestedQuestions }, { status: 200 });
  } catch (error) {
    console.error('API /api/generate-insights error:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate insights/questions.', details: (error as Error).message },
      { status: 500 }
    );
  }
}