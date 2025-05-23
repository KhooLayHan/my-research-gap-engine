/*  
* Defines the structure for a research data point in a timeline.
*/
export interface TimelineData {
  year: number;
  count: number;
}

/*  
* Defines the structure for research data by region.
*/
export interface RegionData {
  name: string;
  count: number;
}

/*  
* Defines the structure for research data by population demographic.
*/
export interface PopulationData {
  name: string;
  count: number;
}

/*  
* Defines the structure for research data by subtopic.
*/
export interface SubtopicData {
  name: string;
  coverage: number;
}

/*  
* Defines the overall structure for the mock research gap data.
*/
export interface ResearchData {
  query: string;
  summary: string;
  timeline: TimelineData[];
  regions: RegionData[];
  populations: PopulationData[];
  subtopics: SubtopicData[];
  insights: string[];
  suggestedQuestions: string[];  
}