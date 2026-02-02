
import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { BrowserRouter: Router, Routes, Route, useLocation, Navigate } = ReactRouterDOM;
import { AppProvider, useStore } from './store';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import LoadingScreen from './components/LoadingScreen';

// Admin Imports
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminProducts from './pages/Admin/Products';
import AdminBanners from './pages/Admin/Banners';
import AdminLogin from './pages/Admin/Login';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isAuthLoading, isAdmin } = useStore();
  
  if (isAuthLoading) {
    return <LoadingScreen />;
  }
  
  if (!session) {
    return <AdminLogin />;
  }

  // Optional: If you want to strictly restrict to 'is_admin' true users only:
  // if (!isAdmin) return <div className="h-screen flex items-center justify-center bg-[#1F1A16] text-[#A68E74] font-serif italic text-2xl">Access Revoked: Insufficient Privileges.</div>;

  return <>{children}</>;
};

const MainContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [exitAnimation, setExitAnimation] = useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    const timer = setTimeout(() => {
      setExitAnimation(true);
      setTimeout(() => setIsLoading(false), 800);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={exitAnimation ? 'animate-scaleOut' : ''}>
        <LoadingScreen />
      </div>
    );
  }

  if (isAdminPath) {
    return (
      <ProtectedAdminRoute>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/banners" element={<AdminBanners />} />
            <Route path="/admin/*" element={<Navigate to="/admin" />} />
          </Route>
        </Routes>
      </ProtectedAdminRoute>
    );
  }

  return (
    <div className="flex flex-col min-h-screen animate-fadeIn">
      <Header />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <MainContent />
      </Router>
    </AppProvider>
  );
};

export default App;
