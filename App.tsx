
import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter: Router, Routes, Route, useLocation, Navigate, Outlet } = ReactRouterDOM;
import { AppProvider, useStore } from './store';
import Header from './components/Header';
import Footer from './components/Footer';
import OfferBar from './components/OfferBar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import LoadingScreen from './components/LoadingScreen';

// Admin Imports
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminProducts from './pages/Admin/Products';
import AdminBanners from './pages/Admin/Banners';
import AdminPromotions from './pages/Admin/Promotions';
import AdminCollections from './pages/Admin/Collections';
import AdminLogin from './pages/Admin/Login';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout for Public Pages
const PublicLayout: React.FC = () => {
  const { isLoading } = useStore();
  const [appLoading, setAppLoading] = useState(true);
  const [exitAnimation, setExitAnimation] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setExitAnimation(true);
        setTimeout(() => setAppLoading(false), 600);
      }, 400); // Small buffer for animation
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (appLoading) {
    return <LoadingScreen key="public-loader" />;
  }

  return (
    <div className="flex flex-col min-h-screen animate-fadeIn">
      <OfferBar />
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

// Resilient Protected Admin Route Handler
const ProtectedAdminRoute: React.FC = () => {
  const { user, isAuthLoading } = useStore();
  
  // If still loading auth, show a brief loader
  if (isAuthLoading && !user) {
    return <LoadingScreen key="admin-auth-loader" />;
  }
  
  // If no user after loading, show login
  if (!user) {
    return <AdminLogin />;
  }

  // Session exists, show the layout
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
            <Route path="/about" element={<About />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="collections" element={<AdminCollections />} />
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
