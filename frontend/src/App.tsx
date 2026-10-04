import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import SignUp    from './pages/SignUp';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Learning  from './pages/Learning';
import HLD       from './pages/HLD';
import Caching   from './pages/Caching';
import Profile   from './pages/Profile';
import AuthNav   from './components/AuthNav';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

const AppRoutes = () => {
  const { pathname } = useLocation();
  const hideDarkNav =
    pathname.startsWith('/learning') ||
    pathname === '/profile' ||
    pathname === '/dashboard' ||
    pathname === '/login' ||
    pathname === '/signup';

  const isLightPage =
    pathname.startsWith('/learning') ||
    pathname === '/profile' ||
    pathname === '/dashboard' ||
    pathname === '/login' ||
    pathname === '/signup';

  // Set html/body background to white for light pages, dark for others
  React.useEffect(() => {
    document.documentElement.style.backgroundColor = isLightPage ? '#FAF9FC' : '#0a0a0f';
    document.body.style.backgroundColor = isLightPage ? '#FAF9FC' : '#0a0a0f';
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, [isLightPage]);

  return (
    <>
      {!hideDarkNav && <Navbar />}
      {(pathname === '/login' || pathname === '/signup') && <AuthNav />}
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />

        <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
        <Route path="/login"  element={<PublicRoute><Login /></PublicRoute>} />

        <Route path="/dashboard"          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/learning"           element={<ProtectedRoute><Learning /></ProtectedRoute>} />
        <Route path="/learning/hld"       element={<ProtectedRoute><HLD /></ProtectedRoute>} />
        <Route path="/learning/hld/caching" element={<ProtectedRoute><Caching /></ProtectedRoute>} />
        <Route path="/profile"            element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </>
  );
};

export default App;
