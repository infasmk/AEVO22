
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Banner, Order, Category, ColorOption } from './types';
import { supabase, isConfigValid } from './supabase';
import { Session, User } from '@supabase/supabase-js';

interface AppState {
  products: Product[];
  banners: Banner[];
  orders: Order[];
  categories: Category[];
  wishlist: string[];
  isLoading: boolean;
  connectionStatus: 'online' | 'offline' | 'connecting' | 'invalid_config';
  
  // Auth State
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  
  fetchData: () => Promise<void>;
  upsertProduct: (p: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  upsertBanner: (b: Banner) => Promise<boolean>;
  deleteBanner: (id: string) => Promise<boolean>;
  upsertCategory: (c: Category) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<boolean>;
  toggleWishlist: (id: string) => void;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'aevo_v26_absolute_live';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting' | 'invalid_config'>('connecting');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const parseColors = (colors: any[]): ColorOption[] => {
    if (!colors || !Array.isArray(colors)) return [];
    return colors.map(c => {
      const parts = String(c).split(':');
      return { name: parts[0] || 'Unknown', hex: parts[1] || '#000000' };
    });
  };

  const stringifyColors = (colors: ColorOption[]): string[] => {
    if (!colors) return [];
    return colors.map(c => `${c.name}:${c.hex}`);
  };

  const verifyAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('is_admin').eq('id', userId).maybeSingle();
      if (!error && data) {
        setIsAdmin(!!data.is_admin);
        return !!data.is_admin;
      }
      setIsAdmin(false);
      return false;
    } catch (e) {
      setIsAdmin(false);
      return false;
    }
  };

  const fetchData = useCallback(async () => {
    if (!isConfigValid()) {
      setConnectionStatus('invalid_config');
      return;
    }

    setConnectionStatus('connecting');
    try {
      // Get data in parallel
      const [pRes, bRes, cRes, oRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('banners').select('*').order('display_order', { ascending: true }),
        supabase.from('categories').select('*').order('name', { ascending: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false })
      ]);

      // If there's an error in critical tables, mark as offline
      if (pRes.error || bRes.error) {
        throw new Error('Database response failed');
      }

      const liveProducts = pRes.data || [];
      const transformed = liveProducts.map(p => ({ ...p, colors: parseColors(p.colors) }));
      setProducts(transformed);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(transformed));

      const liveBanners = bRes.data || [];
      setBanners(liveBanners);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(liveBanners));

      setCategories(cRes.data || []);
      setOrders(oRes.data || []);
      
      setConnectionStatus('online');
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setConnectionStatus('offline');
    }
  }, []);

  // Auth & Initial Data Sequence
  useEffect(() => {
    const initApp = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          await verifyAdmin(initialSession.user.id);
        }
        
        await fetchData();
      } catch (e) {
        console.error("Init error", e);
        setConnectionStatus('offline');
      } finally {
        setIsAuthLoading(false);
        setIsLoading(false);
      }
    };

    initApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setProducts([]);
        setBanners([]);
        setOrders([]);
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}_products`);
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}_banners`);
      } else if (newSession?.user) {
        await verifyAdmin(newSession.user.id);
      }
      
      fetchData();
    });

    return () => subscription.unsubscribe();
  }, [fetchData]);

  // Fast Hydration from Cache (prevents blank flashes)
  useEffect(() => {
    const cachedProducts = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
    const cachedBanners = localStorage.getItem(`${LOCAL_STORAGE_KEY}_banners`);
    const cachedWishlist = localStorage.getItem(`${LOCAL_STORAGE_KEY}_wishlist`);

    if (cachedProducts) setProducts(JSON.parse(cachedProducts));
    if (cachedBanners) setBanners(JSON.parse(cachedBanners));
    if (cachedWishlist) setWishlist(JSON.parse(cachedWishlist));
  }, []);

  const upsertProduct = async (p: Product) => {
    const dbPayload = {
      ...p,
      colors: stringifyColors(p.colors || []),
      price: Number(p.price),
      stock: Number(p.stock)
    };
    const { error } = await supabase.from('products').upsert(dbPayload);
    if (!error) {
      await fetchData();
      return true;
    }
    return false;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      await fetchData();
      return true;
    }
    return false;
  };

  const upsertBanner = async (b: Banner) => {
    const { error } = await supabase.from('banners').upsert(b);
    if (!error) {
      await fetchData();
      return true;
    }
    return false;
  };

  const deleteBanner = async (id: string) => {
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (!error) {
      await fetchData();
      return true;
    }
    return false;
  };

  const upsertCategory = async (c: Category) => {
    const { error } = await supabase.from('categories').upsert(c);
    if (!error) {
      await fetchData();
      return true;
    }
    return false;
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      await fetchData();
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
    setWishlist(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_wishlist`, JSON.stringify(updated));
      return updated;
    });
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/');
    }
  };

  return (
    <AppContext.Provider value={{
      products, banners, orders, wishlist, isLoading, categories, connectionStatus,
      user, session, isAdmin, isAuthLoading,
      fetchData, upsertProduct, deleteProduct, upsertBanner, deleteBanner, 
      upsertCategory, deleteCategory, updateOrderStatus, toggleWishlist, signOut
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
