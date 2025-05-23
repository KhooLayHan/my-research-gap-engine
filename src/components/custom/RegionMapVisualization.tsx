import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { RegionData } from '@/lib/types';

interface RegionMapVisualizationProps {
  data: RegionData[];
}

const RegionMapVisualization: React.FC<RegionMapVisualizationProps> = ({ data }) => {
  return (
    <Card className="shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Research Distribution by Region</CardTitle>
      </CardHeader>
      <CardContent>
        {
          data.length > 0 ? (
            <div className="h-64 flex flex-col justify-center items-center p-2">
              {
                // TODO: Add maps using ?? library
              } 
              <p className="mb-4 text-gray-500">
                {
                  // TODO: Add map visualization, showing research density by region
                }
              </p>
              <ul className="list-disc pl-5 text-gray-700">
                {
                  data.map((item, index) => (
                    <li key={index}>
                      <span className="font-medium">{item.name}: {item.count} studies</span>
                    </li>
                  ))
                }
              </ul>
              <div className="text-xs text-gray-500 mt-2">Years: (Mock Data)</div>
            </div>
          ) : (
            // <div className="h-64 flex flex-col items-center justify-center">
            <p className="text-gray-500">No regional data available for this topic.</p>
            // </div>
          )
        }
      </CardContent>
    </Card>
  );
};

export default RegionMapVisualization;