
import React, { createContext, useContext, useState } from 'react';
import { Product, Banner, Order } from './types';
import { INITIAL_PRODUCTS, INITIAL_BANNERS, MOCK_ORDERS } from './constants';

interface AppState {
  products: Product[];
  banners: Banner[];
  orders: Order[];
  // Added wishlist to AppState to satisfy component requirements
  wishlist: string[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateBanners: (banners: Banner[]) => void;
  // Added toggleWishlist for managing the collection
  toggleWishlist: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  // Initializing the wishlist state
  const [wishlist, setWishlist] = useState<string[]>([]);

  const addProduct = (p: Product) => setProducts(prev => [p, ...prev]);
  const updateProduct = (p: Product) => setProducts(prev => prev.map(item => item.id === p.id ? p : item));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(item => item.id !== id));
  const updateBanners = (b: Banner[]) => setBanners(b);
  
  // Logic to add/remove items from the personal collection
  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <AppContext.Provider value={{
      products, banners, orders, wishlist,
      addProduct, updateProduct, deleteProduct, updateBanners, toggleWishlist
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
