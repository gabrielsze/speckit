import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Discover Amazing Events
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
          Browse conferences, workshops, and networking opportunities. 
          Connect with like-minded professionals and expand your knowledge.
        </p>
        <Link
          href="/events"
          className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
        >
          Browse All Events →
        </Link>
      </div>
    </section>
  );
}
