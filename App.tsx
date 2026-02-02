
import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { BrowserRouter: Router, Routes, Route, useLocation, Navigate, Outlet } = ReactRouterDOM;
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

// Layout for Public Pages (Header + Footer)
const PublicLayout: React.FC = () => {
  const [appLoading, setAppLoading] = useState(true);
  const [exitAnimation, setExitAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExitAnimation(true);
      setTimeout(() => setAppLoading(false), 800);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) {
    return (
      <div className={exitAnimation ? 'animate-scaleOut' : ''}>
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen animate-fadeIn">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

// Protected Admin Route Handler
const ProtectedAdminRoute: React.FC = () => {
  const { session, isAuthLoading } = useStore();
  
  if (isAuthLoading) {
    return <LoadingScreen />;
  }
  
  if (!session) {
    return <AdminLogin />;
  }

  return <AdminLayout />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
