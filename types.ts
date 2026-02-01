
export type Category = 'Men' | 'Women' | 'Wall Clocks' | 'Smart Clocks' | 'Luxury Series';
export type ProductTag = 'Latest' | 'Best Seller' | 'Offer' | 'New Arrival' | 'None';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: Category;
  images: string[];
  specs: Record<string, string>;
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

export interface SiteConfig {
  id: string;
  brand_name: string;
  announcement_text: string;
  contact_email: string;
  contact_phone: string;
}
