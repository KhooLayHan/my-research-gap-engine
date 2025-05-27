'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';

import { ResearchData } from '@/lib/types';
import { loadSavedResearchQueries, deleteResearchQuery } from '@/lib/utils/localStorage';

import { Trash2, ExternalLink } from 'lucide-react';

const SavedQueriesPage: React.FC = () => {
  const [savedQueries, setSavedQueries] = useState<ResearchData[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load queries from local storage when the component mounts
    setSavedQueries(loadSavedResearchQueries());
  }, []);

  const handleLoadQuery = (query: ResearchData) => {
    if (query.query) {
      // Navigate back to the explorer page with the saved topic
      router.push(`/explorer?topic=${encodeURIComponent(query.query)}`);
    }
  };

  const handleDeleteQuery = (queryId: string) => {
    deleteResearchQuery(queryId);
    setSavedQueries(loadSavedResearchQueries()); // Reload the list after deletions
  };

  return (
    <div className="container mx-auto p-4 md:px-8 max-w-6xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        <span className="text-blue-600">Your Saved Research Queries</span>
      </h1>

      {savedQueries.length === 0 ? (
        <Card className="shadow-lg rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">No saved queries found.</p>
          <p className="text-gray-500">
            Explore a topic on the <Link href="/explorer" className="text-blue-600 hover:underline">Explorer page</Link> and click &#34;Save Query&#34; to add it here!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {savedQueries.map((query) => (
            <Card key={query.id} className="shadow-md rounded-lg flex items-center p-4">
              <div className="flex-grow">
                <CardTitle className="text-xl font-semibold text-gray-800 mb-1">{query.query}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">{query.summary || 'No summary available.'}</p>
              </div>
              <div className="flex-shrink-0 flex space-x-2 ml-4">
                <Button
                  variant="outline"
                  title="Load Query"
                  onClick={() => handleLoadQuery(query)}
                >
                  <ExternalLink className="w-5 h-5 text-blue-500"/>Load saved query
                </Button>
                <Button
                  variant="outline"
                  title="Delete Query"
                  onClick={() => query.id && handleDeleteQuery(query.id)}
                >
                  <Trash2 className="w-5 h-5 text-red-500"/>Delete this query
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      { /* Back to Home button */ }
      <div className="text-center mt-12">
        <Button 
          asChild
          variant="outline"
          className="px-6 py-3 text-lg font-semibold text-gray-700 border-gray-300 hover:bg-gray-100 rounded-lg shadow-sm transition-colors duration-200"
        >
          <Link href="/">Back to Home</Link>  
        </Button>
      </div>
    </div>
  );
};

export default SavedQueriesPage;