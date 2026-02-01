
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Banner, Order, Category } from './types';
import { supabase } from './supabase';
import { INITIAL_PRODUCTS, INITIAL_BANNERS, MOCK_ORDERS } from './constants';

interface AppState {
  products: Product[];
  banners: Banner[];
  orders: Order[];
  categories: Category[];
  wishlist: string[];
  isLoading: boolean;
  connectionStatus: 'online' | 'offline' | 'connecting';
  
  fetchData: () => Promise<void>;
  upsertProduct: (p: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  upsertBanner: (b: Banner) => Promise<boolean>;
  deleteBanner: (id: string) => Promise<boolean>;
  upsertCategory: (c: Category) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<boolean>;
  toggleWishlist: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'aevo_vault_v3';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('connecting');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setConnectionStatus('connecting');
    try {
      const [pRes, bRes, oRes, cRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('banners').select('*').order('display_order', { ascending: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name', { ascending: true })
      ]);

      if (pRes.error) throw pRes.error;

      setProducts(pRes.data && pRes.data.length > 0 ? pRes.data : INITIAL_PRODUCTS);
      setBanners(bRes.data && bRes.data.length > 0 ? bRes.data : INITIAL_BANNERS);
      setOrders(oRes.data && oRes.data.length > 0 ? oRes.data : MOCK_ORDERS);
      setCategories(cRes.data && cRes.data.length > 0 ? cRes.data : [
        { id: '1', name: 'Luxury Series' },
        { id: '2', name: 'Wall Clocks' },
        { id: '3', name: 'Men' },
        { id: '4', name: 'Women' }
      ]);
      setConnectionStatus('online');
    } catch (err) {
      console.warn("AEVO: Vault sync unavailable, using local cache fallback.", err);
      setConnectionStatus('offline');
      // Fallback to local storage if DB fails
      const cachedProducts = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
      if (cachedProducts) setProducts(JSON.parse(cachedProducts));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sync state to local storage for offline endurance
  useEffect(() => {
    if (products.length > 0) localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(products));
    if (banners.length > 0) localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(banners));
    if (categories.length > 0) localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(categories));
  }, [products, banners, categories]);

  const upsertProduct = async (p: Product) => {
    const { error } = await supabase.from('products').upsert(p);
    if (!error) {
      setProducts(prev => {
        const exists = prev.find(item => item.id === p.id);
        if (exists) return prev.map(item => item.id === p.id ? p : item);
        return [p, ...prev];
      });
      return true;
    }
    return false;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    }
    return false;
  };

  const upsertBanner = async (b: Banner) => {
    const { error } = await supabase.from('banners').upsert(b);
    if (!error) {
      setBanners(prev => {
        const exists = prev.find(item => item.id === b.id);
        if (exists) return prev.map(item => item.id === b.id ? b : item);
        return [...prev, b];
      });
      return true;
    }
    return false;
  };

  const deleteBanner = async (id: string) => {
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (!error) {
      setBanners(prev => prev.filter(b => b.id !== id));
      return true;
    }
    return false;
  };

  const upsertCategory = async (c: Category) => {
    const { error } = await supabase.from('categories').upsert(c);
    if (!error) {
      setCategories(prev => {
        const exists = prev.find(item => item.id === c.id);
        if (exists) return prev.map(item => item.id === c.id ? c : item);
        return [...prev, c];
      });
      return true;
    }
    return false;
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      setCategories(prev => prev.filter(c => c.id !== id));
      return true;
    }
    return false;
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      return true;
    }
    return false;
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  return (
    <AppContext.Provider value={{
      products, banners, orders, wishlist, isLoading, categories, connectionStatus,
      fetchData, upsertProduct, deleteProduct, upsertBanner, deleteBanner, 
      upsertCategory, deleteCategory, updateOrderStatus, toggleWishlist
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
