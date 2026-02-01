
import React, { createContext, useContext, useState } from 'react';
import { Product, Banner, Order } from './types';
import { INITIAL_PRODUCTS, INITIAL_BANNERS, MOCK_ORDERS } from './constants';

interface AppState {
  products: Product[];
  banners: Banner[];
  wishlist: string[];
  // Added orders to the global state
  orders: Order[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateBanners: (banners: Banner[]) => void;
  toggleWishlist: (productId: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [wishlist, setWishlist] = useState<string[]>([]);
  // Initialized orders with mock data from constants
  const [orders] = useState<Order[]>(MOCK_ORDERS);

  const addProduct = (p: Product) => setProducts(prev => [p, ...prev]);
  const updateProduct = (p: Product) => setProducts(prev => prev.map(item => item.id === p.id ? p : item));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(item => item.id !== id));
  const updateBanners = (b: Banner[]) => setBanners(b);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) 
      ? prev.filter(id => id !== productId) 
      : [...prev, productId]
    );
  };

  return (
    <AppContext.Provider value={{
      products, banners, wishlist, orders,
      addProduct, updateProduct, deleteProduct, updateBanners,
      toggleWishlist
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useStore must be used within AppProvider');
  return context;
};