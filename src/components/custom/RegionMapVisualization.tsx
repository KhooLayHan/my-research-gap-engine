import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { RegionData } from '@/lib/types';

interface RegionMapVisualizationProps {
  data: RegionData[];
}

const RegionMapVisualization: React.FC<RegionMapVisualizationProps> = ({ data }) => {
  // Sort data by count descending for better readability on the chart
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  
  return (
    <Card className="shadow-md rounded-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Research Distribution by Region</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        {
          data.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedData} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200"/>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickFormatter={ (value) => value.toString() } className='text=sm'/>
                  <YAxis tickLine={false} axisLine={false} className='text-sm' width={30}/>
                  <Tooltip 
                </BarChart>
              </ResponsiveContainer>
            
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