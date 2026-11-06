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
import Caching              from './pages/Caching';
import SystemArchitecture   from './pages/SystemArchitecture';
import Scalability          from './pages/Scalability';
import LoadBalancing        from './pages/LoadBalancing';
import DatabaseDesign       from './pages/DatabaseDesign';
import Microservices        from './pages/Microservices';
import ApiGateway           from './pages/ApiGateway';
import MessageQueues        from './pages/MessageQueues';
import CDN                  from './pages/CDN';
import DistributedSystems   from './pages/DistributedSystems';
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
        <Route path="/learning/hld/caching"              element={<ProtectedRoute><Caching /></ProtectedRoute>} />
        <Route path="/learning/hld/system-architecture"  element={<ProtectedRoute><SystemArchitecture /></ProtectedRoute>} />
        <Route path="/learning/hld/scalability"          element={<ProtectedRoute><Scalability /></ProtectedRoute>} />
        <Route path="/learning/hld/load-balancing"       element={<ProtectedRoute><LoadBalancing /></ProtectedRoute>} />
        <Route path="/learning/hld/database-design"      element={<ProtectedRoute><DatabaseDesign /></ProtectedRoute>} />
        <Route path="/learning/hld/microservices"        element={<ProtectedRoute><Microservices /></ProtectedRoute>} />
        <Route path="/learning/hld/api-gateway"          element={<ProtectedRoute><ApiGateway /></ProtectedRoute>} />
        <Route path="/learning/hld/message-queues"       element={<ProtectedRoute><MessageQueues /></ProtectedRoute>} />
        <Route path="/learning/hld/cdn"                  element={<ProtectedRoute><CDN /></ProtectedRoute>} />
        <Route path="/learning/hld/distributed-systems"  element={<ProtectedRoute><DistributedSystems /></ProtectedRoute>} />
        <Route path="/profile"            element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </>
  );
};

export default App;
