'use client';

import { useState } from 'react';
import FAQItem from '@/components/FAQItem';
import { faqs } from '@/data/faqs';

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  // Group FAQs by category
  const faqsByCategory = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions about our events
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(faqsByCategory).map(([category, categoryFaqs]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{category}</h2>
              <div className="space-y-2">
                {categoryFaqs.map(faq => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    isOpen={openId === faq.id}
                    onToggle={() => handleToggle(faq.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
