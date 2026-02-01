
import { Product, Banner, Order } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aurelius Gold Skeleton',
    description: 'A masterpiece of engineering, featuring a visible mechanical heart and 24k gold accents.',
    price: 349000,
    // Fix: originalPrice -> original_price
    original_price: 399000,
    category: 'Luxury Series',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: { 'Movement': 'Mechanical', 'Material': '24k Gold' },
    tag: 'Best Seller',
    stock: 5,
    rating: 4.9,
    // Fix: reviewsCount -> reviews_count
    reviews_count: 124
  },
  {
    id: '2',
    name: 'Luna Minimalist Wall',
    description: 'Clean lines and silent movement for the modern contemporary space.',
    price: 68500,
    category: 'Wall Clocks',
    images: [
      'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: { 'Movement': 'Quartz', 'Material': 'Brushed Steel' },
    tag: 'Latest',
    stock: 15,
    rating: 4.7,
    // Fix: reviewsCount -> reviews_count
    reviews_count: 45
  },
  {
    id: '3',
    name: 'Elysian Rose Quartz',
    description: 'Feminine elegance captured in soft hues and genuine rose quartz dial.',
    price: 98000,
    // Fix: originalPrice -> original_price
    original_price: 125000,
    category: 'Women',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: { 'Movement': 'Automatic', 'Material': 'Rose Gold' },
    tag: 'Offer',
    stock: 8,
    rating: 4.8,
    // Fix: reviewsCount -> reviews_count
    reviews_count: 89
  },
  {
    id: '4',
    name: 'Chronos Smart Elite',
    description: 'Blending traditional horology with cutting-edge smart connectivity.',
    price: 145000,
    category: 'Smart Clocks',
    images: [
      'https://images.unsplash.com/photo-1544117518-30dd5978bbbe?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: { 'Battery': '7 Days', 'Display': 'AMOLED' },
    tag: 'Latest',
    stock: 20,
    rating: 4.6,
    // Fix: reviewsCount -> reviews_count
    reviews_count: 62
  },
  {
    id: '5',
    name: 'Obsidian Midnight',
    description: 'A statement piece for the modern gentleman, crafted from volcanic glass.',
    price: 215000,
    category: 'Men',
    images: [
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: { 'Movement': 'Automatic', 'Material': 'Ceramic' },
    tag: 'New Arrival',
    stock: 12,
    rating: 4.9,
    // Fix: reviewsCount -> reviews_count
    reviews_count: 34
  },
  {
    id: '6',
    name: 'Ivory Horizon Wall',
    description: 'A monolithic wall clock designed for grand minimalist spaces.',
    price: 89000,
    // Fix: originalPrice -> original_price
    original_price: 110000,
    category: 'Wall Clocks',
    images: [
      'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&q=80&w=1000'
    ],
    specs: { 'Movement': 'Quartz', 'Material': 'Alabaster' },
    tag: 'Offer',
    stock: 3,
    rating: 4.8,
    // Fix: reviewsCount -> reviews_count
    reviews_count: 12
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'b1',
    title: 'The Platinum Standard',
    subtitle: 'Limited release precision engineering',
    // Fix: image -> image_url, tag -> tag_label, added display_order
    image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=1600',
    tag_label: 'Latest Models',
    display_order: 1
  },
  {
    id: 'b2',
    title: 'Timeless Interiors',
    subtitle: 'Elevating the architecture of time',
    // Fix: image -> image_url, tag -> tag_label, added display_order
    image_url: 'https://images.unsplash.com/photo-1495856458515-0637185db551?auto=format&fit=crop&q=1600',
    tag_label: 'Best Selling',
    display_order: 2
  },
  {
    id: 'b3',
    title: 'Autumn Collection',
    subtitle: 'Warm tones for refined tastes',
    // Fix: image -> image_url, tag -> tag_label, added display_order
    image_url: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=1600',
    tag_label: 'New Arrivals',
    display_order: 3
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    // Fix: userId -> user_email, total -> total_amount, createdAt -> created_at, userName -> user_name
    user_name: 'James Wilson',
    user_email: 'james.wilson@example.com',
    // Fix: OrderItem mapping to match interface (product_id and image)
    items: [{ 
      id: 'oi1',
      product_id: '1',
      name: 'Aurelius Gold Skeleton',
      price: 349000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000'
    }],
    total_amount: 349000,
    status: 'Shipped',
    created_at: '2024-03-20T10:30:00Z'
  },
  {
    id: 'ORD-1002',
    // Fix: userId -> user_email, total -> total_amount, createdAt -> created_at, userName -> user_name
    user_name: 'Elena Grace',
    user_email: 'elena.grace@example.com',
    // Fix: OrderItem mapping to match interface (product_id and image)
    items: [{ 
      id: 'oi2',
      product_id: '2',
      name: 'Luna Minimalist Wall',
      price: 68500,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&q=80&w=1000'
    }],
    total_amount: 137000,
    status: 'Pending',
    created_at: '2024-03-21T14:15:00Z'
  }
];
