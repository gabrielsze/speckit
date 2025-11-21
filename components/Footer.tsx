export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            EventHub
          </h3>
          <p className="text-gray-400 mb-6">
            Discover and attend amazing events. Connect, learn, and grow.
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a>
            <a href="/events" className="text-gray-400 hover:text-white transition-colors">Events</a>
            <a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 EventHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
