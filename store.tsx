
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

const LOCAL_STORAGE_KEY = 'aevo_v27_final_strict';

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
      // Parallel fetch with error suppression for missing tables (Postgres error 42P01)
      const [pRes, bRes, cRes, oRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('banners').select('*').order('display_order', { ascending: true }),
        supabase.from('categories').select('*').order('name', { ascending: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false })
      ]);

      // Handle table results. If error is 42P01 (relation does not exist), treat as empty [].
      const processRes = (res: any) => {
        if (res.error) {
          if (res.error.code === '42P01') return [];
          throw res.error;
        }
        return res.data || [];
      };

      const liveProducts = processRes(pRes);
      const transformed = liveProducts.map((p: any) => ({ ...p, colors: parseColors(p.colors) }));
      setProducts(transformed);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(transformed));

      const liveBanners = processRes(bRes);
      setBanners(liveBanners);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(liveBanners));

      setCategories(processRes(cRes));
      setOrders(processRes(oRes));
      
      setConnectionStatus('online');
    } catch (err: any) {
      console.error("Critical Registry Sync Error:", err);
      setConnectionStatus('offline');
    }
  }, []);

  // Strict Initialization Lifecycle
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
        setConnectionStatus('offline');
      } finally {
        setIsAuthLoading(false);
        setIsLoading(false);
      }
    };

    initApp();

    // Safety timeout: Ensure loading screen eventually disappears even if network is slow
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
      setIsAuthLoading(false);
    }, 5000);

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

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, [fetchData]);

  // Load from Cache (Strictly internal state, cleared on logout)
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
    
    // Optimistic update
    const oldProducts = [...products];
    setProducts(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) return prev.map(item => item.id === p.id ? p : item);
      return [p, ...prev];
    });

    const { error } = await supabase.from('products').upsert(dbPayload);
    if (error) {
      setProducts(oldProducts);
      return false;
    }
    return true;
  };

  const deleteProduct = async (id: string) => {
    // Optimistic update
    const oldProducts = [...products];
    setProducts(prev => prev.filter(p => p.id !== id));

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      setProducts(oldProducts);
      return false;
    }
    return true;
  };

  const upsertBanner = async (b: Banner) => {
    const oldBanners = [...banners];
    setBanners(prev => {
      const exists = prev.find(item => item.id === b.id);
      if (exists) return prev.map(item => item.id === b.id ? b : item);
      return [...prev, b].sort((x, y) => (x.display_order || 0) - (y.display_order || 0));
    });

    const { error } = await supabase.from('banners').upsert(b);
    if (error) {
      setBanners(oldBanners);
      return false;
    }
    return true;
  };

  const deleteBanner = async (id: string) => {
    const oldBanners = [...banners];
    setBanners(prev => prev.filter(b => b.id !== id));

    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (error) {
      setBanners(oldBanners);
      return false;
    }
    return true;
  };

  const upsertCategory = async (c: Category) => {
    const oldCategories = [...categories];
    setCategories(prev => {
      const exists = prev.find(item => item.id === c.id);
      if (exists) return prev.map(item => item.id === c.id ? c : item).sort((x, y) => x.name.localeCompare(y.name));
      return [...prev, c].sort((x, y) => x.name.localeCompare(y.name));
    });

    const { error } = await supabase.from('categories').upsert(c);
    if (error) {
      setCategories(oldCategories);
      return false;
    }
    return true;
  };

  const deleteCategory = async (id: string) => {
    const oldCategories = [...categories];
    setCategories(prev => prev.filter(c => c.id !== id));

    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      setCategories(oldCategories);
      return false;
    }
    return true;
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
    // Immediate UI feedback
    setSession(null);
    setUser(null);
    setIsAdmin(false);
    
    try {
      // Background sign out
      supabase.auth.signOut().catch(console.error);
      
      // Immediate cleanup and redirect
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } catch (e) {
      window.location.href = '/';
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
