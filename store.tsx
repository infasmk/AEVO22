
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Banner, Order, Category } from './types';
import { supabase } from './supabase';

interface AppState {
  products: Product[];
  banners: Banner[];
  orders: Order[];
  wishlist: string[];
  isLoading: boolean;
  
  // Mutations
  fetchData: () => Promise<void>;
  upsertProduct: (p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  upsertBanner: (b: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  toggleWishlist: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pRes, bRes, oRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('banners').select('*').order('display_order', { ascending: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false })
      ]);

      if (pRes.data) setProducts(pRes.data);
      if (bRes.data) setBanners(bRes.data);
      if (oRes.data) setOrders(oRes.data);
    } catch (err) {
      console.error("Error fetching AEVO data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const upsertProduct = async (p: Partial<Product>) => {
    const { error } = await supabase.from('products').upsert(p);
    if (!error) await fetchData();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) await fetchData();
  };

  const upsertBanner = async (b: Partial<Banner>) => {
    const { error } = await supabase.from('banners').upsert(b);
    if (!error) await fetchData();
  };

  const deleteBanner = async (id: string) => {
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (!error) await fetchData();
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (!error) await fetchData();
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  return (
    <AppContext.Provider value={{
      products, banners, orders, wishlist, isLoading,
      fetchData, upsertProduct, deleteProduct, upsertBanner, deleteBanner, updateOrderStatus, toggleWishlist
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
