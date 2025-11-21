'use client';

import { EventCategory } from '@/types';
import { categories } from '@/data/categories';

interface FilterBarProps {
  categories: EventCategory[];
  priceFilter: 'all' | 'free' | 'paid';
  onCategoryChange: (categories: EventCategory[]) => void;
  onPriceChange: (priceFilter: 'all' | 'free' | 'paid') => void;
}

export default function FilterBar({
  categories: selectedCategories,
  priceFilter,
  onCategoryChange,
  onPriceChange,
}: FilterBarProps) {
  const toggleCategory = (category: EventCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const allCategories: EventCategory[] = ['Conference', 'Workshop', 'Networking', 'Tech Talk'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Events</h3>
        
        {/* Category Filter */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Categories</p>
          <div className="flex flex-wrap gap-2">
            {allCategories.map(category => {
              const isSelected = selectedCategories.includes(category);
              const categoryMeta = categories[category as EventCategory];
              
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                    isSelected
                      ? `${categoryMeta.bgColor} ${categoryMeta.textColor} ring-2 ring-offset-2 ${categoryMeta.ringColor}`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{categoryMeta.icon}</span>
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Price</p>
          <div className="flex gap-2">
            {(['all', 'free', 'paid'] as const).map(option => (
              <button
                key={option}
                onClick={() => onPriceChange(option)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                  priceFilter === option
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option === 'all' ? 'All' : option === 'free' ? 'Free' : 'Paid'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedCategories.length > 0 || priceFilter !== 'all') && (
        <button
          onClick={() => {
            onCategoryChange([]);
            onPriceChange('all');
          }}
          className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
