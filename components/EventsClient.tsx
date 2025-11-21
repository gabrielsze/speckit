'use client';

import { useState } from 'react';
import EventCard from '@/components/EventCard';
import FilterBar from '@/components/FilterBar';
import SearchBar from '@/components/SearchBar';
import { events } from '@/data/events';
import { FilterState, EventCategory } from '@/types';
import { filterEvents, sortEvents } from '@/lib/utils';

type SortOption = 'date-asc' | 'date-desc' | 'name-asc' | 'name-desc';

export default function EventsClient() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceFilter: 'all',
    searchQuery: ''
  });
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');

  const filteredEvents = filterEvents(events, filters);
  const sortedEvents = sortEvents(filteredEvents, sortBy);

  const handleCategoryChange = (categories: EventCategory[]) => {
    setFilters(prev => ({ ...prev, categories }));
  };

  const handlePriceChange = (priceFilter: 'all' | 'free' | 'paid') => {
    setFilters(prev => ({ ...prev, priceFilter }));
  };

  const handleSearchChange = (searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          searchQuery={filters.searchQuery}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* Filters */}
      <FilterBar
        categories={filters.categories}
        priceFilter={filters.priceFilter}
        onCategoryChange={handleCategoryChange}
        onPriceChange={handlePriceChange}
      />
      
      <div className="mt-8">
        {/* Results count and sorting */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            {sortedEvents.length} {sortedEvents.length === 1 ? 'event' : 'events'} found
          </p>
          
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-300">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="date-asc">Date (Earliest First)</option>
              <option value="date-desc">Date (Latest First)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
        
        {sortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No events found matching your criteria</p>
            <button
              onClick={() => setFilters({ categories: [], priceFilter: 'all', searchQuery: '' })}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
