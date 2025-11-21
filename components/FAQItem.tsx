'use client';

import { useState } from 'react';
import { FAQItem as FAQItemType } from '@/types';

interface FAQItemProps {
  faq: FAQItemType;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onToggle}
        className="w-full py-6 px-6 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-lg text-gray-900 dark:text-white pr-8">
          {faq.question}
        </span>
        <span className={`text-2xl text-indigo-600 dark:text-indigo-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
          {faq.answer}
        </div>
      </div>
    </div>
  );
}
