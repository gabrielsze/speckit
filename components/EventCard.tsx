'use client';

import Image from 'next/image';
import { Event } from '@/types';
import { formatDate, formatTime, formatPrice, truncateText } from '@/lib/utils';
import { getCategoryColor, getCategoryIcon } from '@/data/categories';

interface EventCardProps {
  event: Event;
  priority?: boolean;
}

export default function EventCard({ event, priority = false }: EventCardProps) {
  const handleRegister = () => {
    alert(`Registration for "${event.title}" - Coming soon!`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="relative h-48 w-full">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3">
          <span className={`${getCategoryColor(event.category)} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
            <span>{getCategoryIcon(event.category)}</span>
            {event.category}
          </span>
        </div>
        {event.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {truncateText(event.description, 120)}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-2">📅</span>
            <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-2">📍</span>
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm font-semibold">
              <span className="mr-2">💵</span>
              <span className={event.price === 0 ? 'text-green-600' : 'text-gray-900'}>
                {formatPrice(event.price)}
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleRegister}
          className="w-full bg-gradient-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200"
        >
          Register Now
        </button>
      </div>
    </div>
  );
}
