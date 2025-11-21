export interface Event {
  id: number;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  featured: boolean;
}

export type EventCategory = 'Conference' | 'Workshop' | 'Networking' | 'Tech Talk';

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: FAQCategory;
}

export type FAQCategory = 'Registration' | 'Payment' | 'Access' | 'Support';

export interface FilterState {
  categories: EventCategory[];
  priceFilter: 'all' | 'free' | 'paid';
  searchQuery: string;
}

export interface CategoryMeta {
  name: EventCategory;
  displayName: string;
  color: string;
  bgColor: string;
  textColor: string;
  ringColor: string;
  icon: string;
}
