import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WhatIsMissingPanelProps {
  insights: string[];
  suggestedQuestions: string[];
}

const WhatIsMissingPanel: React.FC<WhatIsMissingPanelProps> = ({ insights, suggestedQuestions }) => {
  return (
    <Card className="shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">What&apos;s Missing?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-800">Auto-Generated Insights: </h3>
          {
             insights.length > 0 ? (
              <ul className='list-disc pl-5 text-gray-700 space-y-1'>
                {
                  insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  )
                }
              </ul>
            ) : (
              // <div className="h-64 flex flex-col items-center justify-center">
              <p className="text-gray-500">No specific insights generated yet.</p>
              // </div>
            )
          }
        </div>
        <div>
          <h3 className='text-lg font-medium mb-2 text-gray-800'>Suggested Questions: </h3>
          {
            suggestedQuestions.length > 0 ? (
              <ul className='list-disc pl-5 text-gray-700 space-y-1'>
                {
                  suggestedQuestions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))
                }
              </ul>
            ) : (
              <p className="text-gray-500">No suggested questions at this moment.</p>
            )
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default SubtopicRadar;