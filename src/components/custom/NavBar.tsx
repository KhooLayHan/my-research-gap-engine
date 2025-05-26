'use client'; // This component needs to be a client component for useRouter and Link

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook to get the current path

import { Button } from '@/components/ui/button'; // Assuming ShadCN Button is available

const NavBar: React.FC = () => {
  const pathname = usePathname(); // Get the current path to highlight active link

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explorer', label: 'Explorer' },
    { href: '/insights', label: 'Insights' },
    { href: '/saved-queries', label: 'Saved Queries' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="w-full bg-gray-800 text-white p-4 shadow-lg fixed top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center max-w-6xl">
        {/* Logo/Brand Name */}
        <Link href="/" className="text-2xl font-bold text-blue-300 hover:text-blue-200 transition-colors duration-200">
          ResearchEngine?
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              asChild // Render as a child component (Link)
              variant="ghost" // ShadCN ghost variant for subtle button
              className={`text-lg px-4 py-2 rounded-md transition-colors duration-200
                ${pathname === link.href ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-gray-700 text-gray-300'}
              `}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;