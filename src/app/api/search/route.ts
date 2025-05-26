import { NextResponse } from "next/server";

import { getPerplexityCompletion } from "@/lib/api/perplexity";
import { searchInputSchema } from "@/lib/schemas/searchSchema";
import { ResearchData, TimelineData, RegionData,PopulationData, SubtopicData, PerplexityMessage, PerplexityAPIResponse, PerplexityContentPart } from "@/lib/types";

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
        .map((part: PerplexityContentPart) => part.title)
        .filter(Boolean) 
        .join('\n');
    }
  }
  return 'No detailed contents available.';
}

/**
 * Generates data for the research timeline.
 * Prompts Perplexity to give publication counts by year.
 * 
 * @param topic The topic content string.
 * @returns The TimelineData array.
 */
async function getTimelineData(topic: string): Promise<TimelineData[]> {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 20; // Look back 20 years
  
  const messages: PerplexityMessage[] = [
    { 
      role: 'system', 
      content: `You are a research data analyst. For the "${topic}", provide an estimate of the number of significant academic publications or research papers published per year, focusing on trends from ${startYear} to ${currentYear}. List only the year and an approximate count. Output in the format: "Year: Count". If data for a year is sparse, estimate based on surrounding years or indicate very low.`, 
    },
    { 
      role: 'user', 
      content: `Provide research publication counts for "${topic}" from year ${startYear} to ${currentYear}.`,
    },
  ];

  try {
    const response = await getPerplexityCompletion(messages, 'sonar'); // Use a smaller model for faster numeric extraction
    const content = extractPerplexityContent(response);

    const timelineData: TimelineData[] = [];
    const lines = content.split('\n');

    lines.forEach((line) => {
      const match = line.match(/(\d{4}):\s*(\d+)/);
      if (match) 
        timelineData.push({ year: parseInt(match[1]), count: parseInt(match[2]) });
    });

    // Ensure all years are present, fill with 0 if missing from LLM response
    for (let i = startYear; i <= currentYear; i++) {
      if (!timelineData.some(item => item.year === i)) 
        timelineData.push({ year: i, count: 0 });
    }

    timelineData.sort((a, b) => a.year - b.year);
    return timelineData;
  } catch (error) {
    console.error('Error fetching timeline data: ', error);
    return [];
  }
}

/**
 * Generates data for the research distribution by region.
 * Prompts Perplexity to give research focus across specific regions.
 * 
 * @param topic The topic content string.
 * @returns The RegionData array.
 */
async function getRegionalData(topic:string): Promise<RegionData[]> {
  const targetRegions = ['North America', 'Europe', 'East Asia', 'South Asia', 'Africa', 'Southeast Asia', 'South America', 'Oceania', 'Middle East'];

  const messages: PerplexityMessage[] = [
    {
      role: 'system',
      content: `You are a research geographer. For the topic "${topic}", estimate the relative volume of significant academic research published in the following regions: ${targetRegions.join(', ')}. Provide an approximate number (e.g., 1-100) for each region, where 100 is very high volume and 1 is very low. Output in the format: "Region: Count".`,
    },
    {
      role: 'user',
      content: `Estimate research volume for "${topic}" in ${targetRegions.join(', ')}.`,
    }
  ];

  try {
    const response = await getPerplexityCompletion(messages, 'sonar');
    const content = extractPerplexityContent(response);

    const regionData: RegionData[] = [];
    const lines = content.split('\n');

    lines.forEach((line) => {
      const parts = line.split(': ');
      if (parts.length === 2 && targetRegions.includes(parts[0].trim()))
        regionData.push({ name: parts[0].trim(), count: parseInt(parts[1].trim()) || 0 });
    });

    // Ensure all target regions are present, fill with 0 if missing from LLM response
    targetRegions.forEach((region) => {
      if (!regionData.some(item => item.name === region))
        regionData.push({ name: region, count: 0 });
    });

    return regionData;
  } catch (error) {
    console.error('Error fetching regional data: ', error);
    return [];
  }
}

/**
 * Generates data for population coverage.
 * Prompts Perplexity to give research focus on specific demographics.
 * 
 * @param topic The topic content string.
 * @returns The RegionData array.
 */
async function getPopulationData(topic:string): Promise<PopulationData[]> {
  const targetPopulations = ['Children (0-12 years)', 'Youth (13-24 years)', 'Adults (25-64 years)', 'Elderly (65+ years)', 
    'Low-income groups', 'Rural communities', 'Urban communities', 'Indigenous populations', 'People with disabilities'
  ];

  const messages: PerplexityMessage[] = [
    {
      role: 'system',
      content: `You are a demography researcher. For the topic "${topic}", estimate the relative research focus on the following population groups: ${targetPopulations.join(', ')}. Provide an approximate number (e.g., 1-100) for each group, where 100 is very high focus and 1 is very low. Output in the format: "Population Group: Count".`,
    },
    {
      role: 'user',
      content: `Estimate research focus on "${topic}" for ${targetPopulations.join(', ')}.`,
    },
  ];

  try {
    const response = await getPerplexityCompletion(messages, 'sonar');
    const content = extractPerplexityContent(response);

    const populationData: PopulationData[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line) => {
      const parts = line.split(': ');
      if (parts.length === 2 && targetPopulations.includes(parts[0].trim()))
        populationData.push({ name: parts[0].trim(), count: parseInt(parts[1].trim()) || 0 });
    });
    
    // Ensure all target populations are present, fill with 0 if missing from LLM response
    targetPopulations.forEach((population) => {
      if (!populationData.some(item => item.name === population))
        populationData.push({ name: population, count: 0 });
    });

    return populationData;
  } catch (error) {
    console.error('Error fetching population data: ', error);
    return [];
  }
}

/**
 * Generates data for related subtopics and their coverage.
 * Prompts Perplexity for common subtopics and their relative research coverage.
 * 
 * @param topic The topic content string.
 * @returns The SubtopicData array.
 */
async function getSubtopicData(topic:string): Promise<SubtopicData[]> {
  const messages: PerplexityMessage[] = [
    {
      role: 'system',
      content: `You are a thematic analysis expert. For the topic "${topic}", identify 5-7 major related subtopics. For each subtopic, estimate its relative research coverage as a percentage (0-100%). Output in the format: "Subtopic: Percentage%".`,
    },
    {
      role: 'user',
      content: `Identify key subtopics for "${topic}" and their relative research coverage.`,
    },
  ];    

  try {
    const response = await getPerplexityCompletion(messages, 'sonar');
    const content = extractPerplexityContent(response);

    const subtopicData: SubtopicData[] = [];
    const lines = content.split('\n');

    lines.forEach((line) => {
      const match = line.match(/(.+):\s*(\d+)%/);
      if (match)
        subtopicData.push({ name: match[1].trim(), coverage: parseInt(match[2]) || 0 });
    });

    // Ensure all target subtopics are present, fill with 0 if missing from LLM response
    // const allSubtopics = ['Ethical Considerations', 'Long-term Forecasting', 'Technological Advancements', 'Socioeconomic Impact', 'Environmental Considerations', 'Health and Safety', 'Policy and Regulation'];

    return subtopicData;
  } catch (error) {
    console.error('Error fetching subtopic data: ', error);
    return [];
  }
}

/**
 * Orchestrates API calls to Perplexity, processes results, and detects gaps.
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
async function processPerplexityResultsAndDetectGaps(topic: string): Promise<ResearchData> {
  let summary = 'No summary available.';
  const insights: string[] = [];
  const suggestedQuestions: string[] = [];

  try {
    // Step 1: Get the initial summary of the topic.
    const summaryResponse = await getPerplexityCompletion([
      {
        role: 'system',
        content: `You are a research assistant. Provide a consise summary of the current research landscape for the topic: ${topic}. Focus on key areas, recent trends, and general research activity. Be factual and objective.`,
      },
      {
        role: 'user',
        content: topic,
      },
    ], 'sonar');
;
    summary = extractPerplexityContent(summaryResponse);

    // 2. Fetch data for each visualization dimension
    const [timeline, regions, populations, subtopics] = await Promise.all([
      getTimelineData(topic), getRegionalData(topic), getPopulationData(topic), getSubtopicData(topic),
    ])

    // 3. Detect gaps and generate preliminary insights for each dimension
    // 3A. Timeline Gaps
    const recentYears = timeline.slice(-5); // Last 5 years
    const sumRecentCounts = recentYears.reduce((sum, item) => sum + item.count, 0);
    const avgRecentCount = sumRecentCounts / recentYears.length;
    const overallAvgCount = timeline.reduce((sum, item) => sum + item.count, 0) / timeline.length;
    
    if (recentYears.length > 0 && overallAvgCount > 0 && avgRecentCount < (overallAvgCount * 0.5)) {
      insights.push(`Significant decline in research volume for "${topic}" in recent years (${recentYears[0].year} - ${recentYears[recentYears.length - 1].year}).`);
      suggestedQuestions.push(`What factor contributes to the recent decline in research volume for "${topic}"?`);
    } else if (overallAvgCount < 5) { // Very low overall volume
      insights.push(`Overall research volume on "${topic}" appears to be very low, indicating a broad gap.`);
      suggestedQuestions.push(`What fundamental aspects of "${topic}" requires initial foundational research?`);      
    }
    
    // 3B. Regional Gaps
    const regionThreshold = Math.max(...regions.map(r => r.count || 0)) * 0.1; // 10% of max count
    const underResearchedRegions = regions.filter(r => r.count <= regionThreshold && r.count > 0).sort((a, b) => a.count - b.count);
    const veryLowResearchRegions = regions.filter(r => r.count === 0); 

    if (veryLowResearchRegions.length > 0) {
      insights.push(`Extremely limited or no studies found in **${veryLowResearchRegions.map(r => r.name).join(', ')}** related to "${topic}".`);
      suggestedQuestions.push(`What are the unique challenges and opportunities for "${topic}" research in **${veryLowResearchRegions[0].name}**?`);
    } else if (underResearchedRegions.length > 0) {
      insights.push(`Significant under-representation of research on "${topic}" in regions like **${underResearchedRegions.map(r => r.name).join(', ')}**.`);
      suggestedQuestions.push(`How can international collaborations foster "${topic}" research in **${underResearchedRegions[0].name}**?`);
    }

    // 3C. Population Gaps
    const populationThreshold = Math.max(...populations.map(p => p.count || 0)) * 0.1; // 10% of max count
    const underResearchedPopulations = populations.filter(p => p.count <= populationThreshold && p.count > 0).sort((a, b) => a.count - b.count);
    const veryLowResearchPopulations = populations.filter(p => p.count === 0);

    if (veryLowResearchPopulations.length > 0) {
      insights.push(`Research on "${topic}" rarely focuses on **${veryLowResearchPopulations.map(p => p.name).join(', ')}** demographics.`);
      suggestedQuestions.push(`How does "${topic}" specifically impact the **${veryLowResearchPopulations[0].name}** population, and what research is needed?`);
    } else if (underResearchedPopulations.length > 0) {
      insights.push(`Significant under-representation of "${topic}" research on groups like **${underResearchedPopulations.map(p => p.name).join(', ')}**.`);
      suggestedQuestions.push(`What are the ethical considerations when researching "${topic}" with **${underResearchedPopulations[0].name}**?`);
    }

    // 3D. Subtopic Gaps
    const subtopicThreshold = Math.min(...subtopics.map(s => s.coverage || 100)) + 15; // Low coverage if 15% above minimum
    const underCoveredSubtopics = subtopics.filter(s => s.coverage < subtopicThreshold && s.coverage < 50).sort((a, b) => a.coverage - b.coverage);
    // const veryLowResearchSubtopics = subtopics.filter(item => item.coverage === 0);

    if (underCoveredSubtopics.length > 0) {
      insights.push(`Key aspects like **${underCoveredSubtopics.map(s => s.name).join(', ')}** related to "${topic}" appears to be significantly under-researched.`);
      suggestedQuestions.push(`Explore the **${underCoveredSubtopics[0].name}** aspects of "${topic}" to bridge knowledge gaps.`);
    } 
    // else if (underResearchedSubtopics.length > 0) {
    //   insights.push(`Significant under-representation of research on **${underResearchedSubtopics.map(item => item.name).join(', ')}** subtopics of "${topic}".`);
    //   suggestedQuestions.push(`What are the key areas of "${topic}" that require immediate research attention?`);
    // }

    // 4. Final AI call for comprehensive insights and questions based on ALL detected gaps.
    // Combine all specific insights for a robust final prompt.
    const finalInsightsPrompt = insights.length > 0
      ? `Based on the following identified research gaps for "${topic}":\n- ${insights.join('\n- ')}\n\n Provide 5-7 actionable and novel research questions that would address these gaps.`
      : `For the topic "${topic}", no significant gaps were immediately obvious. Provide 5-7 broad, interdisciplinary research questions that could expand the current knowledge base.`;

    const finalAIResponse = await getPerplexityCompletion([
      {
        role: 'system',
        content: `You are an expert research strategist. Based on the provided information, generate concise insights about research gaps and highly impactful, novel research questions for the given topic. Focus on areas where current research is minimal or absent, suggesting interdisciplinary approaches where possible. Format: First, bullet points for insights, then bullet points for questions.`,
      },
      {
        role: 'user',
        content: finalInsightsPrompt,
      },
    ], 'sonar') // Use a normal model for better quality insights/questions, or pro model instead???

    const finalContent = extractPerplexityContent(finalAIResponse);
    const finalInsights: string[] = [];
    const finalSuggestedQuestions: string[] = [];

    // Simple parsing of final AI response (expecting bullet points) 
    let isParsingInsights = true;
    finalContent.split('\n').forEach(line => {
      line = line.trim();

      if (line.toLowerCase().includes('research questions')) {
        isParsingInsights = false; // Switch to parsing questions
        return;
      }
      if (line.startsWith('-') || line.startsWith('*')) {
        if (isParsingInsights)
          finalInsights.push(line.substring(2).trim());
        else
          finalSuggestedQuestions.push(line.substring(2).trim());
      }
    });
    
    // Fallback if parsing fails or AI doesn't provide enough
    if (finalInsights.length === 0 && insights.length > 0) 
      finalInsights.push(...insights);
    if (finalSuggestedQuestions.length === 0 && suggestedQuestions.length > 0)
      finalSuggestedQuestions.push(...suggestedQuestions);

    return {
      query: topic,
      summary: summary,
      timeline: timeline,
      regions: regions,
      populations: populations,
      subtopics: subtopics,
      insights: finalInsights.filter(Boolean), // Remove any empty strings
      suggestedQuestions: finalSuggestedQuestions.filter(Boolean),
    };
  } catch (error) {
    console.error('Error during research gap processing: ', error);
    
    // Return a default structure or re-throw
    return {
      query: topic,
      summary: `Failed to process research for "${topic}". Please try again or with a different topic.`,
      timeline: [],
      regions: [],
      populations: [],
      subtopics: [],
      insights: ["Could not generate detailed insights due to an error."],
      suggestedQuestions: ["Consider a broader search: What are the main challenges related to this topic?"],
    };
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

    // 2. Process Perplexity results and detect gaps
    // This function now orchestrates all Perplexity calls and gap detection.
    const processedData = await processPerplexityResultsAndDetectGaps(validatedTopic);

    // 3. Return the processed data to the frontend
    return NextResponse.json(processedData, { status: 200 });
  } catch (error) {
    console.error('API /api/search error:', error);
    return NextResponse.json(
      { error: 'Failed to process research request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}