/**
 * Defines the structure for a research data point in a timeline.
 */
export interface TimelineData {
  year: number;
  count: number;
}

/** 
 * Defines the structure for research data by region.
 */
export interface RegionData {
  name: string;
  count: number;
}

/**
 * Defines the structure for research data by population demographic.
 */
export interface PopulationData {
  name: string;
  count: number;
}

/** 
 * Defines the structure for research data by subtopic.
 */
export interface SubtopicData {
  name: string;
  coverage: number;
}

/**  
 * Defines the overall structure for the processed research gap data returned to the frontend.
 */
export interface ResearchData {
  id?: string; // Optional ID for saved queries using local storage
  query: string;
  summary: string;
  timeline: TimelineData[];
  regions: RegionData[];
  populations: PopulationData[];
  subtopics: SubtopicData[];
  insights: string[];
  suggestedQuestions: string[];  
}

// Perplexity Sonar API Specific Types

/**
 * Represents a single message in the chat completion request/response.
 */
export interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string
}

/**
 * Represents a single choice (response) from the Perplexity Sonar API.
 */
export interface PerplexityChoice {
  message: PerplexityMessage;
  finish_reason: string;
  index: number;
}

/**
 * Represents the usage statistics from the Perplexity Sonar API.
 */
export interface PerplexityUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/**
 * Represents the top-level response from the Perplexity Sonar API.
 */
export interface PerplexityAPIResponse {
  id: string;
  model: string;
  created: number;
  choices: PerplexityChoice[];
  usage: PerplexityUsage;
}

/**
 * Represents a simplified search result snippet from Perplexity's response (if available).
 * Note: Perplexity's Sonar API primarily returns chat completions. For search-grounded responses,
 * the 'content' will contain the summary and citations. We'll parse this data.
 */
export interface PerplexitySearchSnippet {
  title: string;
  url: string;
  snippet: string;
}

/**
 * Represents a structured part of the Perplexity response content,
 * specifically for search results if theay are embedded.
 */
export interface PerplexityContentPart {
  title?: string;
  tool_code?: string;
  tool_result?: {
    search_results?: {
      query: string;
      results: PerplexitySearchSnippet[];
    }[];
  };
}

/**
 * Represents the full content structure from a Perplexity Sonar API choice message
 */
export interface PerplexityMessageContent {
  content: PerplexityContentPart[];
}



