'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InsightsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the insights/questions from URL params
  const topic = searchParams.get('topic') || 'Unknown Topic';

  const initialInsights = searchParams.get('insights')?.split('||') || [];
  const initialQuestions = searchParams.get('questions')?.split('||') || [];

  // console.log(topic);
  // console.log(initialInsights);
  // console.log(initialQuestions);

  const [insights, setInsights] = useState<string[]>(initialInsights);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(initialQuestions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Effect to handle initial load or topic change for context
  useEffect(() => {
    if (!topic) {
        setError('No topic provided to generate insights. Please go back to the explorer page.');
        setLoading(false);
    }
  }, [topic]);

  // Function to regenerate suggestions (would be a backend API call)
  const handleRegeneratedSuggestions = async () => {
    if (!topic) {
      setError('No topic provided to generate insights. Please go back to the explorer page.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/generate-insights?topic=${encodeURIComponent(topic)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to regenerate suggestions from API.');
      }

      const data = await response.json();
      setInsights(data.newInsights || []);
      setSuggestedQuestions(data.newQuestions || []);
    } catch (err) {
      console.error('Error regenerating suggestions:', err);
      setError(err instanceof Error ? err.message : 'Failed to regenerate suggestions.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to group questions (simple keyword-based grouping)
  const groupQuestions = (questions: string[]) => {
    const groups: { [key: string]: string[] } = {};

    questions.forEach(q => {
      let isAssigned = false;
      q = q.toLowerCase();

      if (q.includes('ethical')) {
        (groups['Ethical Considerations'] = groups['Ethical Considerations'] || []).push(q);
        isAssigned = true;
      }
      if (q.includes('impact') || q.includes('societal')) {
        (groups['Societal Impact'] = groups['Societal Impact'] || []).push(q);
        isAssigned = true;
      }
      if (q.includes('africa') || q.includes('asia') || q.includes('latin america') || q.includes('region')) {
        (groups['Regional Focus'] = groups['Regional Focus'] || []).push(q);
        isAssigned = true;
      }
      if (q.includes('population') || q.includes('demographic') || q.includes('community')) {
        (groups['Population Groups'] = groups['Population Groups'] || []).push(q);
        isAssigned = true;
      }

      if (!isAssigned) {
        (groups['General/Others'] = groups['General/Others'] || []).push(q);
      }
    });

    return groups;
  };  

  const qroupedQuestions = groupQuestions(suggestedQuestions);

  // Display specific error if no topic or initial data is missing
  if (!topic && insights.length === 0 && suggestedQuestions.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">No Topic or Initial Data</h1>
        <p className="text-gray-700">Please go back to the home page or explorer page to start a new search.</p>
        <Button onClick={() => router.push('/')} className="mt-4">Go to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Insights & Suggested Questions for: <span className="text-blue-600">{topic}</span>
      </h1>

      {/* Insights Panel */}
      <Card className="mb-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {insights.length > 0 ? (
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              {insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No specific insights available for this topic yet. Click "Regenerate" to try again.</p>
          )}
        </CardContent>
      </Card>

      {/* Suggested Questions Panel */}
      <Card className="mb-8 shadow-lg rounded-lg">
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className="text-2xl font-semibold text-gray-800">Suggested Research Questions</CardTitle>
          <Button 
            className='px-4 py-2 text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors duration-200'
            disabled={loading}
            onClick={handleRegeneratedSuggestions}
          >
            {loading ? 'Regenerating...' : 'Regenerate suggestions'}
          </Button>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {!loading && Object.keys(qroupedQuestions).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(qroupedQuestions).map(([group, questions]) => (
                <div key={group}>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Badge variant="outline" className="text-blue-700 border-blue-700">{group}</Badge>
                  </h3>
                  <ul className="list-decimal pl-8 text-gray-700 space-y-2">
                    {questions.map((q, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No suggested questions available for this topic yet. Click "Regenerate" to try again.</p>
          )}
        </CardContent>
      </Card>

      {/* Back to Explorer link */}
      <div className="mt-12 text-center">
        <Button 
          variant="outline"
          className="px-6 py-3 text-lg font-semibold bg-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg shadow-sm transition-colors duration-200"
          onClick={() => router.back()}
        >
          Back to Explorer
        </Button>
      </div>
    </div>
  );
}

export default InsightsPage;