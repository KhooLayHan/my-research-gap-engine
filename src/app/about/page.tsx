import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        About the <span className="text-blue-600">"What's Not Being Researched Engine?"</span>
      </h1>

      {/* Overview Section */}
      <Card className="mb-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-4">
            In the vast and ever-expanding world of academic and scientific inquiry, certain topics receive overwhelming attention, while others, equally vital, remain underexplored. This creates significant knowledge gaps that can impede progress, misdirect resources, and leave critical questions unanswered.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our "What's Not Being Researched Engine?" is designed to address this challenge. It's a powerful tool that goes beyond traditional search, actively identifying and visualizing these overlooked areas in research across various dimensions.
          </p>
        </CardContent>
      </Card>

      {/* How It Works Section */}
      <Card className="mb-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-4">
            At its core, our engine leverages advanced AI capabilities to analyze the current research landscape for any given topic. Here's a simplified breakdown of our process:
          </p>
          <ol className="list-decimal pl-6 text-gray-700 space-y-3">
            <li>
              <span className="font-semibold">Intelligent Data Gathering:</span> When you enter a topic, our backend makes targeted, real-time queries to the web using the Perplexity Sonar API. Unlike traditional search engines, we prompt the AI to specifically look for research volume, trends, and focus across different dimensions (e.g., specific years, geographical regions, demographic groups, and subtopics).
            </li>
            <li>
              <span className="font-semibold">Gap Detection Logic:</span> The raw data from Perplexity is then processed through our custom algorithms. We compare research activity across these dimensions, identifying areas with significantly lower publication counts, declining trends, or a complete absence of studies. We also employ techniques to filter for reputable academic sources and look for signs of active research to minimize false negatives.
            </li>
            <li>
              <span className="font-semibold">Insight Generation:</span> Once gaps are identified, we feed these findings back into an AI model (powered by Perplexity's language model capabilities). This AI synthesizes concise insights about the identified gaps and, most importantly, generates novel, actionable research questions designed to fill those very gaps.
            </li>
            <li>
              <span className="font-semibold">Interactive Visualization:</span> All these insights and data points are presented on the "Gap Explorer" page through interactive charts and visualizations, making complex information easy to understand at a glance. The "Insights" page then consolidates the generated questions for further exploration.
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Perplexity Sonar API Section */}
      <Card className="mb-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Powered by Perplexity Sonar API</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-4">
            The Perplexity Sonar API is fundamental to this project. Its ability to provide real-time, accurate, and citation-backed answers from the web makes it an ideal backbone for our research gap detection. By leveraging its powerful search and language model capabilities, we can dynamically assess the current state of knowledge and pinpoint areas ripe for new exploration.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This API allows us to go beyond static datasets, ensuring our analysis is always based on the most up-to-date information available on the internet.
          </p>
        </CardContent>
      </Card>

      {/* Mission/Team Section (Optional for Hackathon) */}
      <Card className="mb-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to empower researchers, students, policymakers, and curious individuals to identify and pursue impactful research. By highlighting what's currently being overlooked, we aim to foster a more comprehensive, equitable, and innovative research landscape.
          </p>
        </CardContent>
      </Card>

      {/* Back to Home Button */}
      <div className="text-center mt-12">
        <Button asChild variant="outline" className="px-6 py-3 text-lg font-semibold text-gray-700 border-gray-300 hover:bg-gray-100 rounded-lg shadow-sm transition-colors duration-200">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default AboutPage;