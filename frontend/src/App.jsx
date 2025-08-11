import React ,{useState,useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Testcomp from "../src/components/testing"
import  login  from './components/Login';
import  Signup  from './components/Login';
import  AdminDashboard  from './components/Login';
import  UserDashboard  from './components/Login';
import OwnerDashboard from './components/OwnerDashboard';
import { setAuthToken } from './utils/api.js';
import theme from './theme';
import './App.css';

function App() {
  
  const [user,setUser] = useState(null);
  const [loading,setloading] = useState(true);

  useEffect(()=>{
    //check user in login or not 

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if(token && userData){
      setAuthToken(token);
      setUser(JSON.parse(userData));
    }
    setAuthToken(false);
  },[])

  const handleLogin = (userData,token)=>{
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(userData));
    setAuthToken(token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;


  return (
    <Router>
      <Routes>
        {/* PublicRoutes which are user by all */}
        <Route path="/login" element={
          !user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />
        } />
        <Route path="/signup" element={
          !user ? <Signup /> : <Navigate to="/dashboard" />
        } />

                {/* Protected Routes */}
        <Route path="/dashboard" element={
          user ? (
            user.role === 'SYSTEM_ADMIN' ? <AdminDashboard user={user} onLogout={handleLogout} /> :
            user.role === 'NORMAL_USER' ? <UserDashboard user={user} onLogout={handleLogout} /> :
            user.role === 'STORE_OWNER' ? <OwnerDashboard user={user} onLogout={handleLogout} /> :
            <div>Invalid Role</div>
          ) : <Navigate to="/login" />
        } />

        {/* Default Route */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );

}

export default App;