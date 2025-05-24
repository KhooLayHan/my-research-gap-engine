import { NextRequest, NextResponse } from "next/server";

import { getPerplexityCompletion } from "@/lib/api/perplexity";
import { searchInputSchema, SearchInput } from "@/lib/schemas/searchSchema";
import { ResearchData, TimelineData, RegionData,PopulationData, SubtopicData, PerplexityAPIResponse } from "@/lib/types";

// Mock data for gap detection logic (will be replaced with real processing)
const MOCK_TIMELINE_DATA: TimelineData[] = [
  { year: 2000, count: 5 },
  { year: 2005, count: 12 },
  { year: 2010, count: 20 },
  { year: 2015, count: 35 },
  { year: 2020, count: 18 }, // Drop in recent research
  { year: 2021, count: 15 },
  { year: 2022, count: 10 },
  { year: 2023, count: 8 },
  { year: 2024, count: 5 },
];

const MOCK_REGIONS_DATA: RegionData[] = [
  { name: 'North America', count: 80 },
  { name: 'Europe', count: 70 },
  { name: 'Asia (Excluding SEA)', count: 40 },
  { name: 'Southeast Asia', count: 5 }, // Low research
  { name: 'Africa', count: 3 }, // Very low research
  { name: 'South America', count: 7 },
  { name: 'Oceania', count: 10 },
];

const MOCK_POPULATIONS_DATA: PopulationData[] = [
  { name: 'Adults (25-64)', count: 90 },
  { name: 'Youth (13-24)', count: 30 },
  { name: 'Children (0-12)', count: 10 }, // Low research
  { name: 'Elderly (65+)', count: 5 }, // Very low research
  { name: 'Low-Income Groups', count: 8 },
  { name: 'Rural Communities', count: 12 },
];

const MOCK_SUBTOPICS_DATA: SubtopicData[] = [
  { name: 'Policy Implications', coverage: 75 },
  { name: 'Technological Solutions', coverage: 85 },
  { name: 'Social Impact', coverage: 60 },
  { name: 'Economic Factors', coverage: 40 }, // Moderate coverage
  { name: 'Ethical Considerations', coverage: 25 }, // Lower coverage
  { name: 'Long-term Forecasting', coverage: 15 }, // Very low coverage
];

/**
 * Processes the raw text response from Perplexity to extract a summary.
 * In a more advanced implementation, you'd parse structured content or use 
 * a more sophisticated NLP to get a better summary.
 * 
 * @param response The raw response from Perplexity.
 * @returns A summary string.
 */
function extractSummaryFromPerplexityResponse(response: string): string {
  // For a hackathon, a simple approach:
  // Take the first paragraph or a few sentences.
  // Perplexity responses are often well-structured, so you might just take the initial text. 
  const sentences = response.split('.');
  return sentences.slice(0, Math.min(sentences.length, 3)).join('. ') + (sentences.length > 3 ? '...' : '');

  //   const content = response.choices[0].message.content;
  //   if (!content) {
  //     return 'No summary available';
  //   }

  //   const summary = content.split('Summary:')[1]?.trim();
  //   return summary || 'No summary available';
}

/**
 * Placeholder for your research gap detection logic.
 * In a real scenario, this would involve:
 * 1. Making multiple targeted Perplexity API calls (e.g., "topic in Africa", "topic 2023", "topic children").
 * 2. Parsing Perplexity's `tool_results` if it returns structured search data.
 * 3. Counting relevant results, filtering by academic sources, analyzing recency.
 * 4. Applying thresholds and comparisons to identify actual gaps.
 * 5. Using an LLM (potentially Perplexity itself with a specific prompt) to generate insights and questions.
 *
 * For now, this uses the mock data and generates insights/questions based on simple rules.
 * @param topic The research topic.
 * @returns Processed ResearchData.
 */
async function processPerplexityResultsAndDetectGaps(topic: string, rawPerplexityResponse: string): Promise<ResearchData> {
  // --- Step 1: Extract Summary ---
  const summary = extractSummaryFromPerplexityResponse(rawPerplexityResponse);

  // --- Step 2: Simulate Gap Detection (using mock data for now) ---
  // In a real implementation, you would:
  // a. Make targeted Perplexity calls for each dimension (timeline, regions, populations, subtopics).
  //    Example:
  //    const timelineResults = await getPerplexityCompletion([{ role: "user", content: `Number of academic papers on "${topic}" by year from 2000 to 2024.` }]);
  //    const regionResults = await getPerplexityCompletion([{ role: "user", content: `Research volume on "${topic}" in North America, Europe, Africa, Southeast Asia, South America, Oceania.` }]);
  // b. Parse the responses. This might involve looking for numerical counts or specific patterns.
  // c. Apply your gap detection logic (e.g., low counts in recent years, specific regions/populations).

  // For the hackathon MVP, we'll use the mock data and generate insights/questions
  // based on the *mock data's inherent gaps*.
  const insights: string[] = [
    `Significant decline in research volume for "${topic}" post-2020.`,
    `Extremely limited studies found in **Africa** and **Southeast Asia** related to "${topic}".`,
    `Research on "${topic}" rarely focuses on **children** or the **elderly** demographics.`,
    `The **ethical considerations** and **long-term forecasting** aspects of "${topic}" appear to be severely under-researched.`,
  ];
  
  const suggestedQuestions: string[] = [
    `What are the unique challenges and opportunities for "${topic}" research in **sub-Saharan Africa**?`,
    `How does "${topic}" specifically impact the **elderly population** in developing countries?`,
    `What are the **long-term societal implications** of current "${topic}" trends, and how can they be proactively addressed?`,
    `Investigate the effectiveness of community-based interventions for "${topic}" in **rural Southeast Asian** contexts.`,
    `Explore the **ethical frameworks** required for responsible development and deployment of solutions related to "${topic}".`,
  ];

  return {
    query: topic,
    summary: summary,
    timeline: MOCK_TIMELINE_DATA,
    regions: MOCK_REGIONS_DATA,
    populations: MOCK_POPULATIONS_DATA,
    subtopics: MOCK_SUBTOPICS_DATA,
    insights: insights,
    suggestedQuestions: suggestedQuestions,
  };
}

/**
 * Handles GET requests to the /api/search endpoint.
 * This endpoint will fetch research data using Perplexity Sonar API and identify gaps.
 * 
 * @param request - The request object containing the search input.
 * @returns A JSON response containing the research data and gaps.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');

    // 1. Validate inputs using Zod
    const validationResult = searchInputSchema.safeParse({ topic });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid topic provided', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const validatedTopic: string = validationResult.data.topic;

    // 2. Call Perplexity Sonar API
    // We'll ask Perplexity to give us a summary of the topic's research landscape.
    // In a full implementation, you'd make multiple targeted calls for each data points
    // (timeline, regions, populations, subtopics, etc.) and parse their structured outputs if available.
    const perplexityResponse = await getPerplexityCompletion([
      { 
        role: 'system', 
        content: `You are a research assistant. Provide a consise summary of the current research landscape for the topic: ${validatedTopic}. Focus on key areas, recent trends, and any obvious gaps or under-researched aspects based on the general knowledge. Be factual and objective.`,
      },
      { 
        role: 'user', 
        content: validatedTopic,
      },
    ]);

    // Extract the main content from Perplexity's response
    const rawPerplexityContent: string = perplexityResponse.choices[0]?.message?.content || 'No summary available';

    // 3. Process Perplexity results and detect gaps
    // This function will contain your core logic for gap detection.
    const processedData = await processPerplexityResultsAndDetectGaps(validatedTopic, rawPerplexityContent);

    // 4. Return the processed data to the frontend
    return NextResponse.json(processedData, { status: 200 });
  } catch (error) {
    console.error('API /api/search error:', error);
    return NextResponse.json(
      { error: 'Failed to process research request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}