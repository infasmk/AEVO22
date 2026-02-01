
export type ProductTag = 'Latest' | 'Best Seller' | 'Offer' | 'New Arrival' | 'None';

export interface KeyFeature {
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: string; // Changed from fixed union to string for dynamic support
  images: string[];
  specs: Record<string, string>;
  key_features: KeyFeature[]; // New field
  tag: ProductTag;
  stock: number;
  rating: number;
  reviews_count: number;
  created_at?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  tag_label: string;
  display_order: number;
}

export interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  user_name: string;
  user_email: string;
  items: OrderItem[];
  total_amount: number;
  status: 'Pending' | 'Artisan Prep' | 'Shipped' | 'Delivered';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
}
