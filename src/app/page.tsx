'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


const HomePage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const router = useRouter();

  // Handle search submission
  const handleSearch = () => {
    if (topic.trim()) {
      // Encode the topic to safely pass it as a URL parameter
      router.push(`/explorer?topic=${encodeURIComponent(topic.trim())}`);
    }
  }
  
  // Handle example query clicks
  const handleExampleClick = (example: string) => {
    setTopic(example);
    router.push(`/explorer?topic=${encodeURIComponent(example)}`);
  }

  const exampleQueries = [
    'Technology in Mental Health',
    'AI for Accessibility',
    'Sustainable energy',
    'Suitainable Palm Oil Production in Southeast Asia',
    'Impact of Climate Change'
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-3xl text-center p-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        Uncover the uncharted: 
        <br/>
        <span className="text-blue-600">What&apos;s Not Being Researched?</span>
      </h1>
      <p className="text-lg text-gray-700 mb-10 max-w-prose">
        Explore critical knowledge gaps across various fields. Our engine helps to discover overlooked areas, underrepresented populations, and neglected regions in global research.
      </p>

      <div className="w-full flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          type="text"
          placeholder="Enter a topic to explore research gaps..."
          className="flex-grow p-3 text-lg rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          className="px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors duration-200"
          disabled={!topic.trim()}
        >
          Explore Missing Research
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <span className="text-gray-600 mr-2">Try examples: </span>
        { 
          exampleQueries.map((query) => (
            <Badge
              key={query}
              variant="secondary"
              className="cursor-pointer px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition-colors duration-200"
              onClick={() => handleExampleClick(query)}
            >
              {query}
            </Badge>
          ))
        }
      </div>

      <p className="text-gray-500 text-sm mt-auto">
        Powered by Perplexity Sonar API
      </p>
    </div>
  );
};

export default HomePage;