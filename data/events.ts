import { Event } from '@/types';

export const events: Event[] = [
  // Conferences (5)
  {
    id: 1,
    title: "Web Development Summit 2025",
    description: "Join industry leaders for a day of cutting-edge web development talks, workshops, and networking. Learn about the latest frameworks, tools, and best practices.",
    category: "Conference",
    date: "2025-12-15",
    time: "09:00",
    location: "San Francisco, CA",
    price: 199,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "AI & Machine Learning Conference",
    description: "Explore the future of artificial intelligence and machine learning with leading researchers and practitioners from around the world.",
    category: "Conference",
    date: "2025-12-20",
    time: "08:30",
    location: "Boston, MA",
    price: 250,
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop",
    featured: true
  },
  {
    id: 3,
    title: "Digital Marketing Summit",
    description: "Discover the latest trends in digital marketing, SEO, social media, and content strategy from industry experts.",
    category: "Conference",
    date: "2026-01-10",
    time: "09:30",
    location: "New York, NY",
    price: 175,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
    featured: false
  },
  {
    id: 4,
    title: "Cloud Computing Conference",
    description: "Learn about cloud infrastructure, DevOps, and scalable architecture from leading cloud engineers.",
    category: "Conference",
    date: "2026-01-25",
    time: "10:00",
    location: "Seattle, WA",
    price: 200,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    featured: false
  },
  {
    id: 5,
    title: "Cybersecurity Summit",
    description: "Stay ahead of cyber threats with insights from security experts on protecting modern infrastructure.",
    category: "Conference",
    date: "2026-02-05",
    time: "09:00",
    location: "Virtual",
    price: 150,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
    featured: false
  },

  // Workshops (5)
  {
    id: 6,
    title: "React Masterclass Workshop",
    description: "Hands-on workshop covering React 18+ features, hooks, performance optimization, and best practices. Build real-world applications.",
    category: "Workshop",
    date: "2025-12-01",
    time: "13:00",
    location: "Austin, TX",
    price: 99,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
    featured: true
  },
  {
    id: 7,
    title: "UI/UX Design Workshop",
    description: "Learn modern design principles, user research methods, and prototyping tools. Create stunning user experiences.",
    category: "Workshop",
    date: "2025-12-08",
    time: "14:00",
    location: "Los Angeles, CA",
    price: 0,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    featured: true
  },
  {
    id: 8,
    title: "Python Data Science Workshop",
    description: "Master data analysis, visualization, and machine learning with Python. Includes pandas, NumPy, and scikit-learn.",
    category: "Workshop",
    date: "2025-12-12",
    time: "10:00",
    location: "Virtual",
    price: 0,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
    featured: false
  },
  {
    id: 9,
    title: "Mobile App Development Workshop",
    description: "Build cross-platform mobile apps with React Native. Learn navigation, state management, and API integration.",
    category: "Workshop",
    date: "2026-01-15",
    time: "11:00",
    location: "Chicago, IL",
    price: 120,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    featured: false
  },
  {
    id: 10,
    title: "Docker & Kubernetes Workshop",
    description: "Learn containerization and orchestration from scratch. Deploy scalable applications to production.",
    category: "Workshop",
    date: "2026-01-22",
    time: "09:30",
    location: "Portland, OR",
    price: 140,
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=600&fit=crop",
    featured: false
  },

  // Networking (5)
  {
    id: 11,
    title: "Tech Networking Happy Hour",
    description: "Connect with fellow developers, designers, and tech entrepreneurs in a relaxed evening setting. Food and drinks provided.",
    category: "Networking",
    date: "2025-11-28",
    time: "18:00",
    location: "San Francisco, CA",
    price: 0,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
    featured: true
  },
  {
    id: 12,
    title: "Startup Founders Meetup",
    description: "Monthly gathering for startup founders to share experiences, challenges, and successes. Includes pitch sessions.",
    category: "Networking",
    date: "2025-12-05",
    time: "19:00",
    location: "New York, NY",
    price: 0,
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=600&fit=crop",
    featured: false
  },
  {
    id: 13,
    title: "Women in Tech Networking",
    description: "Empowering women in technology through mentorship, collaboration, and community building.",
    category: "Networking",
    date: "2025-12-18",
    time: "17:30",
    location: "Seattle, WA",
    price: 0,
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop",
    featured: false
  },
  {
    id: 14,
    title: "Developer Coffee Meetup",
    description: "Casual morning meetup for developers to discuss projects, share knowledge, and make connections.",
    category: "Networking",
    date: "2026-01-08",
    time: "08:00",
    location: "Austin, TX",
    price: 15,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
    featured: false
  },
  {
    id: 15,
    title: "Freelancer Networking Night",
    description: "Connect with other freelancers, share client strategies, and explore collaboration opportunities.",
    category: "Networking",
    date: "2026-01-30",
    time: "18:30",
    location: "Denver, CO",
    price: 0,
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop",
    featured: false
  },

  // Tech Talks (5)
  {
    id: 16,
    title: "The Future of Web3",
    description: "Explore blockchain technology, decentralized applications, and the future of the internet with industry pioneers.",
    category: "Tech Talk",
    date: "2025-12-03",
    time: "15:00",
    location: "Virtual",
    price: 0,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
    featured: true
  },
  {
    id: 17,
    title: "Serverless Architecture Explained",
    description: "Learn how serverless computing is changing application development and deployment strategies.",
    category: "Tech Talk",
    date: "2025-12-10",
    time: "16:00",
    location: "Virtual",
    price: 0,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
    featured: false
  },
  {
    id: 18,
    title: "Quantum Computing 101",
    description: "Introduction to quantum computing concepts and their potential impact on technology and society.",
    category: "Tech Talk",
    date: "2026-01-12",
    time: "14:00",
    location: "Boston, MA",
    price: 25,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
    featured: false
  },
  {
    id: 19,
    title: "Building Scalable Systems",
    description: "Architectural patterns and practices for building systems that scale to millions of users.",
    category: "Tech Talk",
    date: "2026-01-20",
    time: "13:00",
    location: "Virtual",
    price: 0,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
    featured: false
  },
  {
    id: 20,
    title: "AI Ethics & Responsible Innovation",
    description: "Discussion on ethical considerations in AI development and deployment. Panel of ethicists and technologists.",
    category: "Tech Talk",
    date: "2026-02-15",
    time: "17:00",
    location: "San Francisco, CA",
    price: 30,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    featured: false
  },
];
