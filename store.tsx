
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product, Banner, Order, Category, ColorOption } from './types';
import { supabase, isConfigValid } from './supabase';
import { INITIAL_PRODUCTS, INITIAL_BANNERS } from './constants';
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

const LOCAL_STORAGE_KEY = 'aevo_vault_v17';

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
  
  const authTimeoutRef = useRef<number | null>(null);

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

  // Auth Listener with Instant Reset
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', currentSession.user.id)
            .maybeSingle();
          setIsAdmin(!!profile?.is_admin);
        }
      } catch (err) {
        console.error("AEVO Auth: Init failed", err);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        setProducts(INITIAL_PRODUCTS);
        setBanners(INITIAL_BANNERS);
        return;
      }

      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', newSession.user.id).maybeSingle();
        setIsAdmin(!!profile?.is_admin);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Data Loading Strategy
  useEffect(() => {
    const cachedProducts = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
    const cachedBanners = localStorage.getItem(`${LOCAL_STORAGE_KEY}_banners`);
    const cachedCategories = localStorage.getItem(`${LOCAL_STORAGE_KEY}_categories`);
    const cachedWishlist = localStorage.getItem(`${LOCAL_STORAGE_KEY}_wishlist`);

    if (cachedProducts) setProducts(JSON.parse(cachedProducts));
    else setProducts(INITIAL_PRODUCTS);

    if (cachedBanners) setBanners(JSON.parse(cachedBanners));
    else setBanners(INITIAL_BANNERS);

    if (cachedCategories) setCategories(JSON.parse(cachedCategories));
    else setCategories([{ id: '1', name: 'Luxury Series' }, { id: '2', name: 'Wall Clocks' }]);

    if (cachedWishlist) setWishlist(JSON.parse(cachedWishlist));
    
    setIsLoading(false);
  }, []);

  const fetchData = useCallback(async () => {
    if (!isConfigValid()) {
      setConnectionStatus('invalid_config');
      return;
    }

    setConnectionStatus('connecting');
    try {
      // Re-verify Admin status first
      if (user) {
        const { data: profile, error: pError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();
        if (!pError && profile) setIsAdmin(!!profile.is_admin);
      }

      // Fetch Registry Data
      const [pRes, bRes, cRes, oRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('banners').select('*').order('display_order', { ascending: true }),
        supabase.from('categories').select('*').order('name', { ascending: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false })
      ]);

      // Handle Product Sync
      if (!pRes.error && pRes.data) {
        const transformed = pRes.data.map(p => ({ ...p, colors: parseColors(p.colors) }));
        setProducts(transformed.length > 0 ? transformed : INITIAL_PRODUCTS);
        if (transformed.length > 0) localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(transformed));
      }

      if (!bRes.error && bRes.data) {
        setBanners(bRes.data.length > 0 ? bRes.data : INITIAL_BANNERS);
        if (bRes.data.length > 0) localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(bRes.data));
      }

      if (!cRes.error && cRes.data) {
        setCategories(cRes.data);
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(cRes.data));
      }

      if (!oRes.error && oRes.data) {
        setOrders(oRes.data);
      }
      
      setConnectionStatus('online');
    } catch (err: any) {
      console.warn("AEVO Sync Registry: Disconnected", err.message);
      setConnectionStatus('offline');
    }
  }, [user]);

  useEffect(() => {
    if (session) fetchData();
  }, [fetchData, session]);

  const upsertProduct = async (p: Product) => {
    const dbPayload = {
      ...p,
      id: String(p.id),
      colors: stringifyColors(p.colors || []),
      original_price: p.original_price ? Number(p.original_price) : null,
      price: Number(p.price),
      stock: Number(p.stock)
    };

    const { error } = await supabase.from('products').upsert(dbPayload);
    if (!error) {
      setProducts(prev => {
        const updated = prev.find(item => item.id === p.id) ? prev.map(item => item.id === p.id ? p : item) : [p, ...prev];
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(updated));
        return updated;
      });
      return true;
    }
    return false;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(prev => {
        const filtered = prev.filter(p => p.id !== id);
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(filtered));
        return filtered;
      });
      return true;
    }
    return false;
  };

  const upsertCategory = async (c: Category) => {
    const { error } = await supabase.from('categories').upsert({ id: String(c.id), name: c.name });
    if (!error) {
      setCategories(prev => {
        const updated = prev.find(item => item.id === c.id) ? prev.map(item => item.id === c.id ? c : item) : [...prev, c];
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(updated));
        return updated;
      });
      return true;
    }
    return false;
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      setCategories(prev => {
        const filtered = prev.filter(c => c.id !== id);
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(filtered));
        return filtered;
      });
      return true;
    }
    return false;
  };

  const upsertBanner = async (b: Banner) => {
    const { error } = await supabase.from('banners').upsert({ ...b, id: String(b.id) });
    if (!error) {
      setBanners(prev => {
        const updated = prev.find(item => item.id === b.id) ? prev.map(item => item.id === b.id ? b : item) : [...prev, b];
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(updated));
        return updated;
      });
      return true;
    }
    return false;
  };

  const deleteBanner = async (id: string) => {
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (!error) {
      setBanners(prev => {
        const filtered = prev.filter(b => b.id !== id);
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(filtered));
        return filtered;
      });
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
    await supabase.auth.signOut();
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_products`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_banners`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_categories`);
    setSession(null);
    setUser(null);
    setIsAdmin(false);
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
