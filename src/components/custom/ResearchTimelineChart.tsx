import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { TimelineData } from '@/lib/types';

interface ResearchTimelineChartProps {
  data: TimelineData[];
}

const ResearchTimelineChart: React.FC<ResearchTimelineChartProps> = ({ data }) => {
  return (
    <Card className="shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Research Volume Per Year</CardTitle>
      </CardHeader>
      <CardContent>
        {
          data.length > 0 ? (
            <div className="h-64 flex flex-col justify-end items-start p-2">
              {
                // TODO: Add charts using Recharts library
              } 
              <p className="mb-2 text-gray-500">
                {
                  // TODO: Add chart visualization, showing publications over time
                }
              </p>
              <div className="w-full flex items-end h-full gap-2 border-b border-l pb-1 p1-1">
                {
                  data.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col items-center justify-end"
                      style={{ height: `${(item.count / Math.max(...data.map(d => d.count || 1))) * 90 + 10}%`, width: `${100 / data.length - 2}%`, backgroundColor: '#4299e1' }}
                      title={`${item.count} publications in ${item.year}`}
                    >
                      <span className="text-xs text-white font-bold mb-1">{item.count}</span>
                      <span className="text-xs text-gray-700 w-full text-center rotate-90 origin-bottom-left whitespace-nowrap ml-4">{item.year}</span>
                    </div>
                  ))
                }
              </div>
              <div className="text-xs text-gray-500 mt-2">Years: (Mock Data)</div>
            </div>
          ) : (
            // <div className="h-64 flex flex-col items-center justify-center">
            <p className="text-gray-500">No timeline data available for this topic.</p>
            // </div>
          )
        }
      </CardContent>
    </Card>
  );
};

export default ResearchTimelineChart;