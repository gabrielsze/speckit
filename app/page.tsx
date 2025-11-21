import Hero from '@/components/Hero';
import EventCard from '@/components/EventCard';
import { events } from '@/data/events';

export default function Home() {
  // Get featured events (max 6)
  const featuredEvents = events.filter(e => e.featured).slice(0, 6);

  return (
    <div>
      <Hero />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Featured Events
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Handpicked events you don't want to miss
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} priority={index < 3} />
          ))}
        </div>
        
        {featuredEvents.length === 0 && (
          <p className="text-center text-gray-500">No featured events at this time.</p>
        )}
      </section>
    </div>
  );
}
