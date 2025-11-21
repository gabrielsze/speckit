import { CategoryMeta, EventCategory } from '@/types';

export const categories: Record<EventCategory, CategoryMeta> = {
  'Conference': {
    name: 'Conference',
    displayName: 'Conference',
    color: 'bg-blue-600',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    ringColor: 'ring-blue-500',
    icon: '🎤'
  },
  'Workshop': {
    name: 'Workshop',
    displayName: 'Workshop',
    color: 'bg-green-600',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    ringColor: 'ring-green-500',
    icon: '🛠️'
  },
  'Networking': {
    name: 'Networking',
    displayName: 'Networking',
    color: 'bg-purple-600',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    ringColor: 'ring-purple-500',
    icon: '🤝'
  },
  'Tech Talk': {
    name: 'Tech Talk',
    displayName: 'Tech Talk',
    color: 'bg-orange-600',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    ringColor: 'ring-orange-500',
    icon: '💻'
  }
};

export function getCategoryColor(category: string): string {
  const cat = categories[category as EventCategory];
  return cat?.color || 'bg-gray-500';
}

export function getCategoryIcon(category: string): string {
  const cat = categories[category as EventCategory];
  return cat?.icon || '📅';
}
