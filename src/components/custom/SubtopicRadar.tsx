import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { SubtopicData } from '@/lib/types';

interface SubtopicRadarProps {
  data: SubtopicData[];
}

const SubtopicRadar: React.FC<SubtopicRadarProps> = ({ data }) => {
  // Sort data by coverage descending
  const sortedData = [...data].sort((a, b) => b.coverage - a.coverage);

  return (
    <Card className="shadow-md rounded-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Subtopic Coverage Radar</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        {
          data.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedData} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-gray-200"/>
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    tickLine={false} 
                    axisLine={false} 
                    className="text-sm sm:text-sm"
                    width={220} // Adjust width for longer labels
                  />
                  <XAxis 
                    type="number" 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 100]} // Coverage is 0-100%
                    tickFormatter={(value) => `${value}%`}
                    className="text-sm sm:text-sm"
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className='rounded-lg border bg-white p-2 text-sm sm:text-sm shadow-sm'>
                            <div className='grid grid-cols-2 gap-2'>
                              <div className='flex flex-col'>
                                <span className='text-gray-500'>Subtopic</span>
                                <span className='font-bold text-gray-900'>{payload[0].payload.name}</span>
                              </div>
                              <div className='flex flex-col'>
                                <span className='text-gray-500'>Coverage</span>
                                <span className='font-bold text-gray-900'>{payload[0].payload.coverage}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="coverage" fill="#ef4444" radius={[0, 4, 4, 0]}/> {/* Red bars */}
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No subtopic data available for this topic.</p>
          )
        }
      </CardContent>
    </Card>
  );
};

export default SubtopicRadar;