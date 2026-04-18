export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  description: string;
  specs: Record<string, string>;
  availability: 'available' | 'limited' | 'oos' | 'showroom-only';
  rating: number;
  reviews: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover: string;
  date: string;
  author: string;
}

export interface CartItem extends Product {
  quantity: number;
}
