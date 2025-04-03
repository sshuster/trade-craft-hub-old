
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, passwords should be hashed
  role: 'user' | 'admin';
  email: string;
  createdAt: string;
}

export interface Item {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'new' | 'like new' | 'good' | 'fair' | 'poor';
  location: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

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

// Categories
export const categories = [
  'Electronics',
  'Home & Garden',
  'Clothing',
  'Vehicles',
  'Books',
  'Sports & Outdoors',
  'Toys & Games',
  'Art & Collectibles',
  'Health & Beauty',
  'Tools & Equipment',
];

// Mock items
export const mockItems: Item[] = [
  {
    id: uuidv4(),
    userId: '1',
    title: 'MacBook Pro 16" 2021',
    description: 'M1 Pro chip, 16GB RAM, 512GB SSD, Space Gray. Used for 6 months, excellent condition.',
    price: 1899.99,
    category: 'Electronics',
    condition: 'like new',
    location: 'San Francisco, CA',
    images: ['/placeholder.svg'],
    createdAt: '2023-05-15T14:22:00Z',
    updatedAt: '2023-05-15T14:22:00Z',
  },
  {
    id: uuidv4(),
    userId: '1',
    title: 'Vintage Leather Jacket',
    description: 'Genuine leather, size M, brown color. Some natural wear adds character.',
    price: 120,
    category: 'Clothing',
    condition: 'good',
    location: 'Portland, OR',
    images: ['/placeholder.svg'],
    createdAt: '2023-06-22T09:15:00Z',
    updatedAt: '2023-06-22T09:15:00Z',
  },
  {
    id: uuidv4(),
    userId: '2',
    title: 'Mountain Bike - Trek Marlin 7',
    description: '2022 model, 29" wheels, hydraulic disc brakes, front suspension. Ridden less than 100 miles.',
    price: 650,
    category: 'Sports & Outdoors',
    condition: 'like new',
    location: 'Denver, CO',
    images: ['/placeholder.svg'],
    createdAt: '2023-07-05T16:40:00Z',
    updatedAt: '2023-07-05T16:40:00Z',
  },
  {
    id: uuidv4(),
    userId: '1',
    title: 'Antique Wooden Bookshelf',
    description: 'Solid oak, 6ft tall, 4ft wide. Early 20th century craftsmanship, some minor scratches.',
    price: 350,
    category: 'Home & Garden',
    condition: 'good',
    location: 'Boston, MA',
    images: ['/placeholder.svg'],
    createdAt: '2023-08-12T11:30:00Z',
    updatedAt: '2023-08-12T11:30:00Z',
  },
  {
    id: uuidv4(),
    userId: '2',
    title: 'Sony PlayStation 5',
    description: 'Disc version, includes 2 controllers and 3 games. Original packaging available.',
    price: 499.99,
    category: 'Electronics',
    condition: 'like new',
    location: 'Miami, FL',
    images: ['/placeholder.svg'],
    createdAt: '2023-09-03T08:50:00Z',
    updatedAt: '2023-09-03T08:50:00Z',
  },
  {
    id: uuidv4(),
    userId: '1',
    title: 'First Edition Book Collection',
    description: 'Set of 5 first edition classic novels in pristine condition. Collector\'s items.',
    price: 1200,
    category: 'Books',
    condition: 'good',
    location: 'New York, NY',
    images: ['/placeholder.svg'],
    createdAt: '2023-10-18T13:25:00Z',
    updatedAt: '2023-10-18T13:25:00Z',
  },
];

// Get all items (could be filtered)
export const getItems = (filters?: Partial<Item>) => {
  if (!filters) {
    return mockItems;
  }
  
  return mockItems.filter(item => {
    for (const [key, value] of Object.entries(filters)) {
      if (key === 'title' || key === 'description') {
        if (!(item[key as keyof Item] as string).toLowerCase().includes((value as string).toLowerCase())) {
          return false;
        }
      } else if (item[key as keyof Item] !== value) {
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
      'List up to 5 items',
      'Basic search functionality',
      'Standard listing visibility',
      'Email support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Seller',
    price: 9.99,
    period: 'month',
    features: [
      'List up to 50 items',
      'Advanced search with filters',
      'Featured listings (prioritized in search)',
      'Analytics dashboard',
      'Priority email support'
    ],
    highlight: true
  },
  {
    id: 'business',
    name: 'Business',
    price: 29.99,
    period: 'month',
    features: [
      'Unlimited item listings',
      'Custom storefront',
      'Advanced analytics',
      'API access',
      'Bulk import/export',
      'Dedicated account manager',
      'Phone and email support'
    ]
  }
];
