import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { TimelineData } from '@/lib/types';

interface ResearchTimelineChartProps {
  data: TimelineData[];
}

const ResearchTimelineChart: React.FC<ResearchTimelineChartProps> = ({ data }) => {
  // Sort data by year to ensure the chart is displayed in chronological order
  const sortedData = [...data].sort((a, b) => a.year - b.year);
  
  return (
    <Card className="shadow-md rounded-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Research Volume Per Year</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        {
          sortedData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">  
                <BarChart data={sortedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200"/>
                  <XAxis 
                    dataKey="year" 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => value.toString()} 
                    className="text-sm"
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    className="text-sm" 
                    width={30} // Adjust width to prevents labels from overlapping
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {  
                        return (
                          <div className='rounded-lg border bg-white p-2 text-sm shadow-sm'>
                            <div className='grid grid-cols-2 gap-2'>
                              <div className='flex flex-col'>
                                <span className='text-gray-500'>Year</span>
                                <span className='font-bold text-gray-900'>{payload[0].payload.year}</span>
                              </div>
                              <div className='flex flex-col'>
                                <span className='text-gray-500'>count</span>
                                <span className='text-gray-900'>{payload[0].payload.count}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                    />
                  <Legend />
                  <Bar dataKey="count" fill="#4299e1" radius={[4, 4, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No timeline data available for this topic.</p>
          )
        }
      </CardContent>
    </Card>
  );
};

export default ResearchTimelineChart;