import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            EventHub
          </Link>
          <div className="flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Events
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
