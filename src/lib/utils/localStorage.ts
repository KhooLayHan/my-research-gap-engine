import { ResearchData } from "@/lib/types";

const STORAGE_KEY = "savedResearchQueries";

/**
 * Loads all saved research queries from local storage.
 * 
 * @returns An array of ResearchData objects, or an empty array if none are found.
 */
export function loadSavedResearchQueries(): ResearchData[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const jsonString = localStorage.getItem(STORAGE_KEY);
    return jsonString ? JSON.parse(jsonString) : [];
  } catch (error) {
    console.error("Error loading saved research queries: ", error);
    return [];
  }
}

/**
 * Saves an array of research queries to local storage.
 * 
 * @param queries The array of ResearchData objects to save.
 */
export function saveResearchQueries(queries: ResearchData[]): void {
  if (typeof window === 'undefined') {
    return; // Do nothing if not in browser environment
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queries));
  } catch (error) {
    console.error("Error saving research queries to local storage: ", error);
  }
}

/**
 * Adds a new research query to the saved list.
 * 
 * @param query The ResearchData object to add.
 */
export function addSavedResearchQuery(query: ResearchData): void {
  if (!query.id) {
    console.warn("No ID provided for research query. Generating a new one.");
    query.id = crypto.randomUUID();
  }

  const existingQueries = loadSavedResearchQueries();
  // Filter out old versions of the query if an item with the same ID already exists
  const updatedQueries = existingQueries.filter(q => q.id !== query.id);
  updatedQueries.push(query);
  saveResearchQueries(updatedQueries);
}

/**
 * Deletes a specific research query from local storage.
 * 
 * @param queryId The ID of the research query to delete.
 */
export function deleteResearchQuery(queryId: string): void {
  const existingQueries = loadSavedResearchQueries();
  const updatedQueries = existingQueries.filter(q => q.id !== queryId);
  saveResearchQueries(updatedQueries);
}