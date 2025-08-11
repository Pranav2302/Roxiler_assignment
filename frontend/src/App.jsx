import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Fade } from '@mui/material';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import StoreOwnerDashboard from './components/StoreOwnerDashboard';
import { setAuthToken } from './utils/api';

function App() {
  const [user, setUser] = useState(null);

  // Check if user is already logged in when app starts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setAuthToken(token);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthToken(token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      }}
    >
      <Router>
        <Routes>
          {/* If user is logged in, dashboard directly*/}
          <Route path="/login" element={
            !user ? (
              <Fade in={true} timeout={500}>
                <div><Login onLogin={handleLogin} /></div>
              </Fade>
            ) : <Navigate to="/dashboard" />
          } />
          
          <Route path="/signup" element={
            !user ? (
              <Fade in={true} timeout={500}>
                <div><Signup /></div>
              </Fade>
            ) : <Navigate to="/dashboard" />
          } />
          
          <Route path="/dashboard" element={
            user ? (
              <Fade in={true} timeout={500}>
                <div>
                  {user.role === 'SYSTEM_ADMIN' ? 
                    <AdminDashboard user={user} onLogout={handleLogout} /> :
                  user.role === "NORMAL_USER" ? 
                    <UserDashboard user={user} onLogout={handleLogout}/> :
                  user.role === 'STORE_OWNER' ? 
                    <StoreOwnerDashboard user={user} onLogout={handleLogout} /> :
                  <div>Invalid Role</div>
                  }
                </div>
              </Fade>
            ) : <Navigate to="/login" />
          } />
          
          {/* Admin route (same as dashboard for admin) */}
          <Route path="/admin" element={<Navigate to="/dashboard" />} />
          
          {/* Default route */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;