
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Banner, Order, Category, ColorOption } from './types';
import initialData from './data.json';

interface AppState {
  products: Product[];
  banners: Banner[];
  orders: Order[];
  categories: Category[];
  wishlist: string[];
  isLoading: boolean;
  
  // Auth State (Local)
  user: { email: string; id: string } | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  
  upsertProduct: (p: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  upsertBanner: (b: Banner) => Promise<boolean>;
  deleteBanner: (id: string) => Promise<boolean>;
  upsertCategory: (c: Category) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<boolean>;
  toggleWishlist: (id: string) => void;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  
  // JSON Portability
  exportData: () => string;
  importData: (json: string) => boolean;
  loadData: (forceServer?: boolean) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'aevo_v27_json_mode';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Load Initial State
  const loadData = useCallback(async (forceServer = false) => {
    setIsLoading(true);
    try {
      const DATA_URL = import.meta.env.VITE_DATA_URL;
      let serverData = initialData;

      if (DATA_URL) {
        try {
          const res = await fetch(DATA_URL);
          if (res.ok) serverData = await res.json();
        } catch (err) {
          console.warn("Could not fetch remote data, falling back to local bundle.");
        }
      }

      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const data = (saved && !forceServer) ? JSON.parse(saved) : serverData;
      
      setProducts(data.products || []);
      setBanners(data.banners || []);
      setCategories(data.categories || []);
      setOrders(data.orders || []);
      
      const savedWishlist = localStorage.getItem(`${LOCAL_STORAGE_KEY}_wishlist`);
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedUser = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setUser(u);
        setIsAdmin(true);
      }
    } catch (e) {
      console.error("Data Load Error:", e);
      setProducts(initialData.products as Product[]);
      setBanners(initialData.banners as Banner[]);
      setCategories(initialData.categories as Category[]);
    } finally {
      setIsLoading(false);
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync to LocalStorage whenever state changes
  useEffect(() => {
    if (isLoading) return;
    const data = { products, banners, categories, orders };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [products, banners, categories, orders, isLoading]);

  const upsertProduct = async (p: Product) => {
    setProducts(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) return prev.map(item => item.id === p.id ? p : item);
      return [p, ...prev];
    });
    return true;
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    return true;
  };

  const upsertBanner = async (b: Banner) => {
    setBanners(prev => {
      const exists = prev.find(item => item.id === b.id);
      if (exists) return prev.map(item => item.id === b.id ? b : item);
      return [...prev, b].sort((x, y) => (x.display_order || 0) - (y.display_order || 0));
    });
    return true;
  };

  const deleteBanner = async (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    return true;
  };

  const upsertCategory = async (c: Category) => {
    setCategories(prev => {
      const exists = prev.find(item => item.id === c.id);
      if (exists) return prev.map(item => item.id === c.id ? c : item).sort((x, y) => x.name.localeCompare(y.name));
      return [...prev, c].sort((x, y) => x.name.localeCompare(y.name));
    });
    return true;
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    return true;
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    return true;
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_wishlist`, JSON.stringify(updated));
      return updated;
    });
  };

  const atelierProtocol = (input: string) => {
    return input.split('').map(c => (c.charCodeAt(0) + 13).toString(16)).join('');
  };

  const signIn = async (email: string, pass: string) => {
    // Obfuscated credential validation (Atelier Protocol v17)
    // Encoded versions of "aevo@gmail.com" and "aevo@1313"
    const registryKey = '6e72837c4d747a6e76793b707c7a';
    const accessKey = '6e72837c4d3e403e40';

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPass = pass.trim();

    if (atelierProtocol(normalizedEmail) === registryKey && atelierProtocol(normalizedPass) === accessKey) {
      const u = { email: normalizedEmail, id: 'admin-1' };
      setUser(u);
      setIsAdmin(true);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(u));
      return true;
    }
    return false;
  };

  const signOut = async () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_user`);
    window.location.href = '/';
  };

  const exportData = () => {
    const data = { products, banners, categories, orders };
    return JSON.stringify(data, null, 2);
  };

  const importData = (json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.products) setProducts(data.products);
      if (data.banners) setBanners(data.banners);
      if (data.categories) setCategories(data.categories);
      if (data.orders) setOrders(data.orders);
      return true;
    } catch (e) {
      console.error("Import Error:", e);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      products, banners, orders, wishlist, isLoading, categories,
      user, isAdmin, isAuthLoading,
      upsertProduct, deleteProduct, upsertBanner, deleteBanner, 
      upsertCategory, deleteCategory, updateOrderStatus, toggleWishlist, 
      signIn, signOut, exportData, importData, loadData
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
