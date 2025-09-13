'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600 italic">Glassbox</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Workflow Builder
            </Link>
            <Link href="/agents" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Agents
            </Link>
            <Link href="/docs" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Docs
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Sign In
              </Link>
              <Link 
                href="/" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Start Building
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="text-gray-900 block px-3 py-2 text-base font-medium">
                Workflow Builder
              </Link>
              <Link href="/agents" className="text-gray-500 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Agents
              </Link>
              <Link href="/docs" className="text-gray-500 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Docs
              </Link>
              <div className="border-t border-gray-200 pt-4">
                <Link href="/login" className="text-gray-500 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                  Sign In
                </Link>
                <Link 
                  href="/" 
                  className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors mt-2"
                >
                  Start Building
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}