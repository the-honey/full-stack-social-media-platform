import { ReactNode, useContext, useState } from 'react';
import Login from '@/pages/Login/Login';
import Register from '@/pages/Register/Register';
import Home from '@/pages/Home/Home';
import Navbar from '@/components/Navbar';
import LeftBar from '@/components/LeftBar';
import RightBar from '@/components/RightBar';
import Profile from '@/pages/Profile/Profile';
import { AuthContext, AuthProvider } from '@/context/authContext';
import useAuth from '@/context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes, Outlet, Navigate } from 'react-router-dom';
//import { ProtectedRoute } from '@/components/ProtectedRoute';

function App() {
  const { currentUser } = useContext(AuthContext);

  const queryClient = new QueryClient();

  const ProtectedRoute = () => {
    const { currentUser } = useAuth();
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return <Outlet />;
  };

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <div style={{ display: 'flex' }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar />
        </div>
      </QueryClientProvider>
    );
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<Layout />}>
            <Route path="/profile/:username" element={<Profile />} />
          </Route>
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
