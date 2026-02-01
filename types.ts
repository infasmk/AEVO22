
export type Category = 'Men' | 'Women' | 'Wall Clocks' | 'Smart Clocks' | 'Luxury Series';
export type ProductTag = 'Latest' | 'Best Seller' | 'Offer' | 'New Arrival' | 'None';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  images: string[];
  specs: Record<string, string>;
  tag: ProductTag;
  stock: number;
  rating: number;
  reviewsCount: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
}

// Added OrderItem to represent a product in an order with quantity
export interface OrderItem extends Product {
  quantity: number;
}

// Added Order interface to match mock data structure
export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
}