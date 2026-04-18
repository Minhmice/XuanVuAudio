import { Product, Category, Brand, Article } from './types';

export const BRANDS: Brand[] = [
  { id: '1', name: 'Sennheiser', slug: 'sennheiser', logo: 'https://picsum.photos/seed/senn/200/100' },
  { id: '2', name: 'Sony', slug: 'sony', logo: 'https://picsum.photos/seed/sony/200/100' },
  { id: '3', name: 'Beyerdynamic', slug: 'beyerdynamic', logo: 'https://picsum.photos/seed/beyer/200/100' },
  { id: '4', name: 'HiFiMAN', slug: 'hifiman', logo: 'https://picsum.photos/seed/hifi/200/100' },
  { id: '5', name: 'FiiO', slug: 'fiio', logo: 'https://picsum.photos/seed/fiio/200/100' },
];

export const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Headphones', slug: 'headphones', image: 'https://picsum.photos/seed/head/400/400' },
  { id: 'c2', name: 'IEMs', slug: 'iems', image: 'https://picsum.photos/seed/iem/400/400' },
  { id: 'c3', name: 'DAC/AMP', slug: 'dac-amp', image: 'https://picsum.photos/seed/dac/400/400' },
  { id: 'c4', name: 'Speakers', slug: 'speakers', image: 'https://picsum.photos/seed/speak/400/400' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Sennheiser HD 600',
    slug: 'sennheiser-hd-600',
    brand: 'Sennheiser',
    category: 'Headphones',
    price: 399,
    compareAtPrice: 450,
    image: 'https://picsum.photos/seed/hd600/600/600',
    description: 'The Sennheiser HD 600 is an audiophile-grade open-back dynamic headphone.',
    specs: { Impendance: '300 Ohms', Weight: '260g', Type: 'Open-back' },
    availability: 'available',
    rating: 4.8,
    reviews: 1240
  },
  {
    id: 'p2',
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    brand: 'Sony',
    category: 'Headphones',
    price: 348,
    image: 'https://picsum.photos/seed/xm5/600/600',
    description: 'Industry-leading noise cancellation with the Sony WH-1000XM5.',
    specs: { 'Battery Life': '30 hrs', Weight: '250g', Noise: 'Active' },
    availability: 'limited',
    rating: 4.7,
    reviews: 852
  },
  {
    id: 'p3',
    name: 'Moondrop Aria',
    slug: 'moondrop-aria',
    brand: 'Moondrop',
    category: 'IEMs',
    price: 79,
    image: 'https://picsum.photos/seed/aria/600/600',
    description: 'The gold standard for budget-friendly IEMs.',
    specs: { Driver: 'LCP Dynamic', Sensitivity: '122dB' },
    availability: 'available',
    rating: 4.5,
    reviews: 3200
  },
  {
    id: 'p4',
    name: 'FiiO K7',
    slug: 'fiio-k7',
    brand: 'FiiO',
    category: 'DAC/AMP',
    price: 199,
    image: 'https://picsum.photos/seed/k7/600/600',
    description: 'Balanced Desktop DAC and Headphone Amplifier.',
    specs: { Output: '2000mW', Inputs: 'USB, Optical, Coax' },
    availability: 'showroom-only',
    rating: 4.9,
    reviews: 156
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'Top 5 Open-Back Headphones of 2024',
    slug: 'top-5-open-back-2024',
    excerpt: 'We review the best open-back headphones for critical listening...',
    cover: 'https://picsum.photos/seed/art1/800/400',
    date: 'Oct 15, 2024',
    author: 'Audio Master'
  },
  {
    id: 'a2',
    title: 'How to Choose Your First DAC',
    slug: 'choosing-first-dac',
    excerpt: 'Everything you need to know about Digital-to-Analog Converters...',
    cover: 'https://picsum.photos/seed/art2/800/400',
    date: 'Nov 02, 2024',
    author: 'Tech Guru'
  }
];
