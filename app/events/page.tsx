import EventsClient from '@/components/EventsClient';

export const metadata = {
  title: 'Browse Events - Eventure',
  description: 'Discover and register for conferences, workshops, and networking events',
};

export default function EventsPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Browse All Events</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover your next learning opportunity or networking event
          </p>
        </div>
        
        <EventsClient />
      </div>
    </div>
  );
}
