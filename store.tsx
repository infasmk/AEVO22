
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

const LOCAL_STORAGE_KEY = 'aevo_vault_v4';

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

      const finalProducts = pRes.data && pRes.data.length > 0 ? pRes.data : INITIAL_PRODUCTS;
      const finalBanners = bRes.data && bRes.data.length > 0 ? bRes.data : INITIAL_BANNERS;
      const finalOrders = oRes.data && oRes.data.length > 0 ? oRes.data : MOCK_ORDERS;
      const finalCategories = cRes.data && cRes.data.length > 0 ? cRes.data : [
        { id: '1', name: 'Luxury Series' },
        { id: '2', name: 'Wall Clocks' },
        { id: '3', name: 'Men' },
        { id: '4', name: 'Women' }
      ];

      setProducts(finalProducts);
      setBanners(finalBanners);
      setOrders(finalOrders);
      setCategories(finalCategories);
      setConnectionStatus('online');

      // Update local storage for immediate future refreshes
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(finalProducts));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(finalBanners));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(finalCategories));

    } catch (err) {
      console.warn("AEVO: Vault sync delayed, relying on local archive.", err);
      setConnectionStatus('offline');
      
      const cachedProducts = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
      if (cachedProducts) setProducts(JSON.parse(cachedProducts));
      else setProducts(INITIAL_PRODUCTS);

      const cachedBanners = localStorage.getItem(`${LOCAL_STORAGE_KEY}_banners`);
      if (cachedBanners) setBanners(JSON.parse(cachedBanners));
      else setBanners(INITIAL_BANNERS);

      const cachedCategories = localStorage.getItem(`${LOCAL_STORAGE_KEY}_categories`);
      if (cachedCategories) setCategories(JSON.parse(cachedCategories));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const upsertProduct = async (p: Product) => {
    // 1. Update UI Instantly (Optimistic Update)
    setProducts(prev => {
      const exists = prev.find(item => item.id === p.id);
      let newProducts;
      if (exists) newProducts = prev.map(item => item.id === p.id ? p : item);
      else newProducts = [p, ...prev];
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(newProducts));
      return newProducts;
    });

    // 2. Persist to DB
    const { error } = await supabase.from('products').upsert(p);
    if (error) {
      console.error("Supabase sync failed, item stored in local archive only.", error);
      return false;
    }
    return true;
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => {
      const filtered = prev.filter(p => p.id !== id);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(filtered));
      return filtered;
    });
    const { error } = await supabase.from('products').delete().eq('id', id);
    return !error;
  };

  const upsertBanner = async (b: Banner) => {
    setBanners(prev => {
      const exists = prev.find(item => item.id === b.id);
      let newBanners;
      if (exists) newBanners = prev.map(item => item.id === b.id ? b : item);
      else newBanners = [...prev, b];
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(newBanners));
      return newBanners;
    });
    const { error } = await supabase.from('banners').upsert(b);
    return !error;
  };

  const deleteBanner = async (id: string) => {
    setBanners(prev => {
      const filtered = prev.filter(b => b.id !== id);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(filtered));
      return filtered;
    });
    const { error } = await supabase.from('banners').delete().eq('id', id);
    return !error;
  };

  const upsertCategory = async (c: Category) => {
    setCategories(prev => {
      const exists = prev.find(item => item.id === c.id);
      let newCats;
      if (exists) newCats = prev.map(item => item.id === c.id ? c : item);
      else newCats = [...prev, c];
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(newCats));
      return newCats;
    });
    const { error } = await supabase.from('categories').upsert(c);
    return !error;
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => {
      const filtered = prev.filter(c => c.id !== id);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(filtered));
      return filtered;
    });
    const { error } = await supabase.from('categories').delete().eq('id', id);
    return !error;
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
