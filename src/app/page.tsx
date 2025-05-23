// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }

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
      router.push(`/explorer?topic=${ encodeURIComponent(topic.trim()) }`);
    }
  }

  // Handle example query clicks
  const handleExampleClick = (example: string) => {
    setTopic(example);
    router.push(`/explorer?topic=${ encodeURIComponent(example) }`);
  }

  const exampleQueries = [
    'Mental Health in Africa',
    'AI for Accessibility',
    'Sustainable energy',
    'Suitainable Palm Oil Production in Southeast Asia', // Is local relevance necessary?
    'Impact of Climate Change'
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-2xl text-center p-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        Uncover the uncharted: 
        <br/>
        <span className="text-blue-600">What's Not Being Researched?</span>
      </h1>
      <p className="text-lg text-gray-700 mb-10 max-w-prose">
        Explore critical knowledge gaps with across various fields. Our engine helps to discover overlooked areas, underrepresented populations, and neglected regions in global research.
      </p>

      <div className="w-full flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          type="text"
          placeholder="Enter a topicto explore research gaps..."
          className="flex-grow p-3 text-lg rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={ topic }
          onChange={ (e) => setTopic(e.target.value) }
          onKeyDown={ (e) => e.key === 'Enter' && handleSearch() }
        />
        <Button
          onClick={ handleSearch }
          className="px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors duration-200"
          disabled={ !topic.trim() }
        >
          Explore Missing Research
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <span className="text-gray-600 mr-2">Try examples: </span>
        { 
          exampleQueries.map((query) => (
            <Badge
              key={ query }
              variant="secondary"
              className="cursor-pointer px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition-colors duration-200"
              onClick={ () => handleExampleClick(query) }
            >
              { query }
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