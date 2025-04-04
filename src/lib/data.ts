
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, passwords should be hashed
  role: 'user' | 'admin';
  email: string;
  createdAt: string;
}

export interface MusicItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  genre: string;
  tempo: 'slow' | 'medium' | 'fast';
  mood: string;
  musicUrl: string;
  location: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  category?: string; // Adding this for backward compatibility
  condition?: string; // Adding this for backward compatibility
}

// Alias MusicItem as Item for backward compatibility
export type Item = MusicItem;

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'muser',
    password: 'muser',
    role: 'user',
    email: 'muser@example.com',
    createdAt: '2023-01-15T08:30:00Z',
  },
  {
    id: '2',
    username: 'mvc',
    password: 'mvc',
    role: 'admin',
    email: 'mvc@example.com',
    createdAt: '2023-01-01T12:00:00Z',
  },
];

// Music Genres
export const genres = [
  'Rock',
  'Pop',
  'Classical',
  'Jazz',
  'Electronic',
  'Hip Hop',
  'R&B',
  'Country',
  'Folk',
  'Ambient',
  'Soundtrack',
  'World',
];

// Music Moods
export const moods = [
  'Happy',
  'Sad',
  'Energetic',
  'Calm',
  'Inspiring',
  'Dramatic',
  'Romantic',
  'Mysterious',
  'Epic',
  'Playful',
  'Nostalgic',
  'Intense',
];

// Categories (using genres as categories for simplicity)
export const categories = genres;

// Conditions for items
export const conditions = [
  'new',
  'like new',
  'good',
  'fair',
  'poor'
];

// Mock music items with added category and condition fields
export const mockItems: MusicItem[] = [
  {
    id: uuidv4(),
    userId: '1',
    title: 'Summer Breeze',
    description: 'Uplifting pop track perfect for summer commercials or travel videos.',
    price: 49.99,
    genre: 'Pop',
    tempo: 'medium',
    mood: 'Happy',
    musicUrl: 'https://example.com/music/summer-breeze',
    location: 'Los Angeles, CA',
    images: ['/placeholder.svg'],
    createdAt: '2023-05-15T14:22:00Z',
    updatedAt: '2023-05-15T14:22:00Z',
    category: 'Pop',
    condition: 'new'
  },
  {
    id: uuidv4(),
    userId: '1',
    title: 'Urban Night',
    description: 'Hip hop beat with atmospheric elements. Great for urban scenes or fashion videos.',
    price: 39.99,
    genre: 'Hip Hop',
    tempo: 'medium',
    mood: 'Mysterious',
    musicUrl: 'https://example.com/music/urban-night',
    location: 'New York, NY',
    images: ['/placeholder.svg'],
    createdAt: '2023-06-22T09:15:00Z',
    updatedAt: '2023-06-22T09:15:00Z',
    category: 'Hip Hop',
    condition: 'like new'
  },
  {
    id: uuidv4(),
    userId: '2',
    title: 'Epic Journey',
    description: 'Orchestral track with powerful percussion. Perfect for trailers or epic scenes.',
    price: 79.99,
    genre: 'Soundtrack',
    tempo: 'fast',
    mood: 'Epic',
    musicUrl: 'https://example.com/music/epic-journey',
    location: 'London, UK',
    images: ['/placeholder.svg'],
    createdAt: '2023-07-05T16:40:00Z',
    updatedAt: '2023-07-05T16:40:00Z',
    category: 'Soundtrack',
    condition: 'new'
  },
  {
    id: uuidv4(),
    userId: '1',
    title: 'Peaceful Morning',
    description: 'Ambient piano piece with gentle strings. Ideal for wellness or meditation content.',
    price: 29.99,
    genre: 'Ambient',
    tempo: 'slow',
    mood: 'Calm',
    musicUrl: 'https://example.com/music/peaceful-morning',
    location: 'Seattle, WA',
    images: ['/placeholder.svg'],
    createdAt: '2023-08-12T11:30:00Z',
    updatedAt: '2023-08-12T11:30:00Z',
    category: 'Ambient',
    condition: 'good'
  },
  {
    id: uuidv4(),
    userId: '2',
    title: 'Cyberpunk Dreams',
    description: 'Futuristic electronic track with driving beat. Perfect for tech videos or gaming.',
    price: 59.99,
    genre: 'Electronic',
    tempo: 'fast',
    mood: 'Intense',
    musicUrl: 'https://example.com/music/cyberpunk-dreams',
    location: 'Berlin, Germany',
    images: ['/placeholder.svg'],
    createdAt: '2023-09-03T08:50:00Z',
    updatedAt: '2023-09-03T08:50:00Z',
    category: 'Electronic',
    condition: 'new'
  },
  {
    id: uuidv4(),
    userId: '1',
    title: 'Vintage Jazz Lounge',
    description: 'Smooth jazz combo with piano and saxophone. Great for sophisticated scenes or lounges.',
    price: 44.99,
    genre: 'Jazz',
    tempo: 'medium',
    mood: 'Nostalgic',
    musicUrl: 'https://example.com/music/vintage-jazz',
    location: 'Chicago, IL',
    images: ['/placeholder.svg'],
    createdAt: '2023-10-18T13:25:00Z',
    updatedAt: '2023-10-18T13:25:00Z',
    category: 'Jazz',
    condition: 'like new'
  },
];

// Get all items (could be filtered)
export const getItems = (filters?: Partial<MusicItem>) => {
  if (!filters) {
    return mockItems;
  }
  
  return mockItems.filter(item => {
    for (const [key, value] of Object.entries(filters)) {
      if (key === 'title' || key === 'description') {
        if (!(item[key as keyof MusicItem] as string).toLowerCase().includes((value as string).toLowerCase())) {
          return false;
        }
      } else if (item[key as keyof MusicItem] !== value) {
        return false;
      }
    }
    return true;
  });
};

// Get user items
export const getUserItems = (userId: string) => {
  return mockItems.filter(item => item.userId === userId);
};

// Get item by ID
export const getItemById = (id: string) => {
  return mockItems.find(item => item.id === id);
};

// Pricing plans
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  highlight?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'month',
    features: [
      'List up to 5 tracks',
      'Basic search visibility',
      'Standard listing placement',
      'Email support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Musician',
    price: 9.99,
    period: 'month',
    features: [
      'List up to 50 tracks',
      'Advanced search placement',
      'Featured listings (prioritized in search)',
      'Analytics dashboard',
      'Priority email support'
    ],
    highlight: true
  },
  {
    id: 'business',
    name: 'Studio',
    price: 29.99,
    period: 'month',
    features: [
      'Unlimited track listings',
      'Custom profile page',
      'Advanced analytics',
      'API access',
      'Bulk upload tools',
      'Dedicated account manager',
      'Phone and email support'
    ]
  }
];
