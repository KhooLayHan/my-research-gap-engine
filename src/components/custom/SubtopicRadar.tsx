import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { SubtopicData } from '@/lib/types';

interface SubtopicRadarProps {
  data: SubtopicData[];
}

const SubtopicRadar: React.FC<SubtopicRadarProps> = ({ data }) => {
  return (
    <Card className="shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Subtopic Coverage Radar</CardTitle>
      </CardHeader>
      <CardContent>
        {
          data.length > 0 ? (
            <div className="h-64 flex flex-col justify-center items-center p-2">
              {
                // TODO: Add radar chart using ?? library
              } 
              <p className="mb-4 text-gray-500">
                {
                  // TODO: Add radar chart visualization, showing coverage of related subtopics 
                }
              </p>
              <ul className="list-disc pl-5 text-gray-700">
                {
                  data.map((item, index) => (
                    <li key={index}>
                      <span className="font-medium">{item.name}: {item.coverage} studies</span>
                    </li>
                  ))
                }
              </ul>
              <div className="text-xs text-gray-500 mt-2">Years: (Mock Data)</div>
            </div>
          ) : (
            // <div className="h-64 flex flex-col items-center justify-center">
            <p className="text-gray-500">No subtopic data available for this topic.</p>
            // </div>
          )
        }
      </CardContent>
    </Card>
  );
};

export default SubtopicRadar;