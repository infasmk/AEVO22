
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  
  fetchData: () => Promise<void>;
  upsertProduct: (p: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  upsertBanner: (b: Banner) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  upsertCategory: (c: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  toggleWishlist: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'aevo_vault_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
    return cached ? JSON.parse(cached) : INITIAL_PRODUCTS;
  });
  const [banners, setBanners] = useState<Banner[]>(() => {
    const cached = localStorage.getItem(`${LOCAL_STORAGE_KEY}_banners`);
    return cached ? JSON.parse(cached) : INITIAL_BANNERS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const cached = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orders`);
    return cached ? JSON.parse(cached) : MOCK_ORDERS;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const cached = localStorage.getItem(`${LOCAL_STORAGE_KEY}_categories`);
    return cached ? JSON.parse(cached) : [
      { id: '1', name: 'Luxury Series' },
      { id: '2', name: 'Wall Clocks' },
      { id: '3', name: 'Men' },
      { id: '4', name: 'Women' },
      { id: '5', name: 'Smart Clocks' }
    ];
  });
  
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Persistence hooks
  useEffect(() => localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(banners)), [banners]);
  useEffect(() => localStorage.setItem(`${LOCAL_STORAGE_KEY}_orders`, JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(categories)), [categories]);

  const fetchData = async () => {
    try {
      const [pRes, bRes, oRes, cRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('banners').select('*').order('display_order', { ascending: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name', { ascending: true })
      ]);

      if (pRes.data && pRes.data.length > 0) setProducts(pRes.data);
      if (bRes.data && bRes.data.length > 0) setBanners(bRes.data);
      if (oRes.data && oRes.data.length > 0) setOrders(oRes.data);
      if (cRes.data && cRes.data.length > 0) setCategories(cRes.data);
    } catch (err) {
      console.warn("AEVO: Database sync unavailable, using local vault.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const upsertProduct = async (p: Product) => {
    setProducts(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) return prev.map(item => item.id === p.id ? p : item);
      return [p, ...prev];
    });
    try { await supabase.from('products').upsert(p); } catch (e) {}
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try { await supabase.from('products').delete().eq('id', id); } catch (e) {}
  };

  const upsertBanner = async (b: Banner) => {
    setBanners(prev => {
      const exists = prev.find(item => item.id === b.id);
      if (exists) return prev.map(item => item.id === b.id ? b : item);
      return [...prev, b];
    });
    try { await supabase.from('banners').upsert(b); } catch (e) {}
  };

  const deleteBanner = async (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    try { await supabase.from('banners').delete().eq('id', id); } catch (e) {}
  };

  const upsertCategory = async (c: Category) => {
    setCategories(prev => {
      const exists = prev.find(item => item.id === c.id);
      if (exists) return prev.map(item => item.id === c.id ? c : item);
      return [...prev, c];
    });
    try { await supabase.from('categories').upsert(c); } catch (e) {}
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    try { await supabase.from('categories').delete().eq('id', id); } catch (e) {}
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    try { await supabase.from('orders').update({ status }).eq('id', id); } catch (e) {}
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  return (
    <AppContext.Provider value={{
      products, banners, orders, wishlist, isLoading, categories,
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
