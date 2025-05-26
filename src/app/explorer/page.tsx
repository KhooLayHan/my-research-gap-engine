'use client';

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Hook to read URL parameters 

import { v4 as uuidv4 } from 'uuid';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ResearchTimelineChart from "@/components/custom/ResearchTimelineChart";
import RegionMapVisualization from "@/components/custom/RegionMapVisualization";
import PopulationHeatmap from "@/components/custom/PopulationHeatmap";
import SubtopicRadar from "@/components/custom/SubtopicRadar";
import WhatIsMissingPanel from "@/components/custom/WhatIsMissingPanel";

import { ResearchData } from "@/lib/types";
import { addSavedResearchQuery } from "@/lib/utils/localStorage";

const ExplorerPage: React.FC = () => {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "No Topic Provided";
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
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
      setSaveMessage(null); // Clear any existing save messages

      try {
        // Call your new Next.js API route
        const response = await fetch(`/api/search?topic=${encodeURIComponent(topic)}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch research data from API.');
        }

        const data = await response.json();
        
        setResearchData({ ...data, id: uuidv4() });
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
  
  // console.log(7, researchData);
  // console.log(8, setResearchData);
  
  const handleSaveQuery = () => {
    if (researchData) {
      addSavedResearchQuery(researchData);
      setSaveMessage('Query saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Analyzing Research Gaps...</h1>
        <p className="text-gray-600">This may take a few seconds, please wait while we gather insights for &#34;{topic}&#34;.</p>
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">No research data found for &#34;{topic}&#34;.</h1>
        <p className="text-gray-600">Could not retrieve research data for &#34;{topic}&#34;.</p>
      </div>
    );
  }

  console.log(researchData.summary);
  // console.log(researchData.query);
  // console.log(researchData.insights);
  // console.log(researchData.suggestedQuestions);
  
  // Helper to clean up text (remove markdown bold and list hyphens)
  const cleanText = (text: string) => text.replace(/\*\*/g, '').replace(/^- /, '').replace(/^# /, '').trim();

  // Helper to clean up Y-axis labels for SubtopicRadar
  const cleanYAxisLabel = (text: string) => text.replace(/^- /, '').replace(/\*\*/g, '').trim();

  // console.log(researchData.insights.map(cleanText));
  // console.log(researchData.suggestedQuestions.map(cleanText));
  
  return (
    <div className="container mx-auto p-4 md:px-8 max-w-6xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Research Gaps for: <span className="text-blue-600">{researchData.query}</span>
      </h1>

      {/* Save Query Button and Message */}
      <div className="flex justify-end mb-4 items-center">
        {saveMessage && (
          <span className="text-green-600 text-sm mr-4 transition-opacity duration-300">
            {saveMessage}
          </span>
        )}
        <Button
          onClick={handleSaveQuery}
          disabled={!researchData || loading}
          className="px-4 py-2 text-md font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-colors duration-200"
        >
          Save Query
        </Button>
      </div>

      { /* Queried Summary Section */ }
      <Card className="mb-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Topic Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Split summary by double newline for paragraphs and clean each paragraph */}
          {researchData.summary.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed mb-2 last:mb-0">
              {cleanText(paragraph)}
            </p>
          ))}
        </CardContent>
      </Card>

      { /* Research Gap Visualization */ }
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
        <ResearchTimelineChart data={researchData.timeline}/>
        <RegionMapVisualization data={researchData.regions}/>
        <PopulationHeatmap data={researchData.populations}/>
        <SubtopicRadar data={researchData.subtopics.map(subtopic => ({
          ...subtopic,
          name: cleanYAxisLabel(subtopic.name)
        }))}/>
      </div>
      
      { /* What's Missing Panel */ }
      <div className="mb-8">
        <WhatIsMissingPanel 
          insights={researchData.insights.map(cleanText)}
          suggestedQuestions={researchData.suggestedQuestions.map(cleanText)}
        />
      </div>

      { /* Link to Insights/Suggested Questions Page */ }
      <div className="text-center mt-12">
        <p className="text-gray-600">
          For more in-depth analysis and to generate additional suggested questions, visit the 
          <Button
            variant="link"
            className="text-blue-600 hover:underline p-0 h-auto ml-1"
            onClick={() => router.push(
              `/insights?topic=${encodeURIComponent(researchData.query)}` +
              `&insights=${encodeURIComponent(researchData.insights.map(cleanText).join('||'))}` +
              `&questions=${encodeURIComponent(researchData.suggestedQuestions.map(cleanText).join('||'))}`
            )}
          >
            Insights Page
          </Button>.
        </p>
      </div>
    </div>
  );
}

export default ExplorerPage;