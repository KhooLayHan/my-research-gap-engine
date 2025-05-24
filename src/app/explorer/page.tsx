'use client';

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Hook to read URL parameters 

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ResearchTimelineChart from "@/components/custom/ResearchTimelineChart";
import RegionMapVisualization from "@/components/custom/RegionMapVisualization";
import PopulationHeatmap from "@/components/custom/PopulationHeatmap";
import SubtopicRadar from "@/components/custom/SubtopicRadar";
import WhatIsMissingPanel from "@/components/custom/WhatIsMissingPanel";

import { ResearchData } from "@/lib/types";

const ExplorerPage: React.FC = () => {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "No Topic Provided";

  const [loading, setLoading] = useState(true);
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if a topic is provided
    if (!topic) {
      setError('No topic provided. Please go back to the home page and enter a topic to explore research gaps.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setResearchData(null); // Clear any existing data
      setError(null); // Clear any existing errors

    try {
      // Call your new Next.js API route
      const response = await fetch(`/api/search?topic=${encodeURIComponent(topic)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch research data from API.');
      }

      const data = await response.json();
      setResearchData(data.processedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message || 'Failed to load research data. Please try again.' : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

    fetchData(); // Execute the function when the component mounts or the topic changes
  }, [topic]); // Dependency array: re-run when topic changes
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Analyzing Research Gaps...</h1>
        <p className="text-gray-600">This may take a few seconds, please wait while we gather insights for &quote;{topic}&quote;.</p>
        {
          // TODO: Add a loading spinner
        }
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mt-8"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error!</h1>
        <p className="text-gray-700">{error}</p>
        <p className="text-gray-500 mt-2">Please try again searching for a different topic.</p>
      </div>
    );
  }

  if (!researchData) {
    // TODO: This case should ideally be covered by error handling or a loading state, but as a fallback.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">No research data found for &quote;{topic}&quote;.</h1>
        <p className="text-gray-600">Could not retrieve research data for &quote;{topic}&quote;.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:px-8 max-w-6xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Research Gaps for: <span className="text-blue-600">{researchData.query}</span>
      </h1>

      { /* Queried Summary Section */ }
      <Card className="mb-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Topic Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 loading-relaxed">{researchData.summary}</p>
        </CardContent>
      </Card>

      { /* Research Gap Visualization */ }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
        <ResearchTimelineChart data={researchData.timeline}/>
        <RegionMapVisualization data={researchData.regions}/>
        <PopulationHeatmap data={researchData.populations}/>
        <SubtopicRadar data={researchData.subtopics}/>
      </div>
      
      { /* What's Missing Panel */ }
      <div className="mb-8">
        <WhatIsMissingPanel 
          insights={researchData.insights}
          suggestedQuestions={researchData.suggestedQuestions}
        />
      </div>

      { /* Link to Insights/Suggested Questions  (Future) */ }
      <div className="text-center mt-12">
        <p className="text-gray-600">
          For more in-depth analysis and to generate additional suggested questions, visit the <a href="/insights" className="text-blue-600 hover:underline ml-1">Insights</a> page (Coming Soon).
        </p>
      </div>
    </div>
  );
}

export default ExplorerPage;