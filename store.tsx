
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product, Banner, Order, Category, ColorOption } from './types';
import { supabase, isConfigValid } from './supabase';
import { INITIAL_PRODUCTS, INITIAL_BANNERS, MOCK_ORDERS } from './constants';
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

const LOCAL_STORAGE_KEY = 'aevo_vault_v15';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting' | 'invalid_config'>('connecting');
  
  // Auth States
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const lastWriteTime = useRef<number>(0);

  // Helper to map DB string array to ColorOption objects
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

  // Auth Listener
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', currentSession.user.id)
            .maybeSingle();
          
          if (!profileError && profile) {
            setIsAdmin(!!profile.is_admin);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (err) {
        console.error("AEVO Auth Engine: Initialization failure.", err);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', newSession.user.id)
          .maybeSingle();
        setIsAdmin(!!profile?.is_admin);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Initial local load
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

    // Throttle fetches to avoid excessive DB calls during rapid state changes
    if (Date.now() - lastWriteTime.current < 2000) return;

    setConnectionStatus('connecting');
    try {
      // Fetch products (Public access)
      const pRes = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (pRes.data && pRes.data.length > 0) {
        const transformedProducts = pRes.data.map(p => ({
          ...p,
          colors: parseColors(p.colors)
        }));
        setProducts(transformedProducts);
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(transformedProducts));
      }

      // Fetch banners (Public access)
      const bRes = await supabase.from('banners').select('*').order('display_order', { ascending: true });
      if (bRes.data && bRes.data.length > 0) {
        setBanners(bRes.data);
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(bRes.data));
      }

      // Fetch categories (Public access)
      const cRes = await supabase.from('categories').select('*').order('name', { ascending: true });
      if (cRes.data && cRes.data.length > 0) {
        setCategories(cRes.data);
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(cRes.data));
      }

      // Fetch orders (Private access - might fail if not admin)
      const oRes = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (oRes.data) setOrders(oRes.data);
      
      setConnectionStatus('online');
    } catch (err: any) {
      console.warn("AEVO Sync Engine: Remote partially disconnected.", err.message);
      setConnectionStatus('offline');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const upsertProduct = async (p: Product) => {
    lastWriteTime.current = Date.now();
    setProducts(prev => {
      const exists = prev.find(item => item.id === p.id);
      const updated = exists ? prev.map(item => item.id === p.id ? p : item) : [p, ...prev];
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(updated));
      return updated;
    });

    if (!isConfigValid()) return false;

    const dbPayload = {
      id: String(p.id),
      name: p.name,
      description: p.description,
      price: Number(p.price),
      original_price: p.original_price ? Number(p.original_price) : null,
      category: p.category,
      images: p.images || [],
      colors: stringifyColors(p.colors || []), 
      specs: p.specs || {},
      key_features: p.key_features || [],
      tag: p.tag || 'None',
      stock: Number(p.stock) || 0,
      rating: Number(p.rating) || 5,
      reviews_count: Number(p.reviews_count) || 0,
      created_at: p.created_at || new Date().toISOString()
    };

    try {
      const { error } = await supabase.from('products').upsert(dbPayload);
      return !error;
    } catch (err) {
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    lastWriteTime.current = Date.now();
    setProducts(prev => {
      const filtered = prev.filter(p => p.id !== id);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(filtered));
      return filtered;
    });
    const { error } = await supabase.from('products').delete().eq('id', id);
    return !error;
  };

  const upsertCategory = async (c: Category) => {
    lastWriteTime.current = Date.now();
    setCategories(prev => {
      const exists = prev.find(item => item.id === c.id);
      const updated = exists ? prev.map(item => item.id === c.id ? c : item) : [...prev, c];
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(updated));
      return updated;
    });
    const { error } = await supabase.from('categories').upsert({ id: String(c.id), name: c.name });
    return !error;
  };

  const deleteCategory = async (id: string) => {
    lastWriteTime.current = Date.now();
    setCategories(prev => {
      const filtered = prev.filter(c => c.id !== id);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(filtered));
      return filtered;
    });
    const { error } = await supabase.from('categories').delete().eq('id', id);
    return !error;
  };

  const upsertBanner = async (b: Banner) => {
    lastWriteTime.current = Date.now();
    setBanners(prev => {
      const updated = prev.find(item => item.id === b.id) ? prev.map(item => item.id === b.id ? b : item) : [...prev, b];
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(updated));
      return updated;
    });
    const { error } = await supabase.from('banners').upsert({ ...b, id: String(b.id) });
    return !error;
  };

  const deleteBanner = async (id: string) => {
    lastWriteTime.current = Date.now();
    setBanners(prev => {
      const filtered = prev.filter(b => b.id !== id);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_banners`, JSON.stringify(filtered));
      return filtered;
    });
    const { error } = await supabase.from('banners').delete().eq('id', id);
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
    setWishlist(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_wishlist`, JSON.stringify(updated));
      return updated;
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
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
