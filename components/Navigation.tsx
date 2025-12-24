'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex-shrink-0">
            Eventure
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <Link href="/" className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors whitespace-nowrap">
              Home
            </Link>
            <Link href="/events" className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors whitespace-nowrap">
              Events
            </Link>
            <Link href="/faq" className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors whitespace-nowrap">
              FAQ
            </Link>
            <Link href="/submit" className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors whitespace-nowrap">
              <span className="sm:hidden">Submit</span>
              <span className="hidden sm:inline">Submit Event</span>
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              aria-label="Toggle dark mode"
            >
              <span className="text-lg">{darkMode ? '☀️' : '🌙'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
