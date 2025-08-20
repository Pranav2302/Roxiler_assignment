import axios from "axios";

// Determine API base URL based on environment
const getApiBase = () => {
  if (process.env.NODE_ENV === 'production') {
    return "/api";
  }
  return 'http://localhost:5000/api'; // Local development
};

const API_BASE = getApiBase();

console.log('API_BASE:', API_BASE);
console.log('NODE_ENV:', process.env.NODE_ENV);

export const setAuthToken = (token) => {
    if(token){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }else{
        delete axios.defaults.headers.common['Authorization'];
    };
}

//auth apis
export const login = (email,password) => {
    console.log('Making login request to:', `${API_BASE}/auth/login`);
    return axios.post(`${API_BASE}/auth/login`,{email,password});
}

export const signup = (userData) => {
    console.log('Making signup request to:', `${API_BASE}/auth/signup`);
    return axios.post(`${API_BASE}/auth/signup`,userData);
}

//admin apis
export const getDashboardStats = () => 
  axios.get(`${API_BASE}/admin/dashboard`);

export const getAllUsers = () => 
  axios.get(`${API_BASE}/admin/users`);

export const getAllStores = () => 
  axios.get(`${API_BASE}/admin/stores`);

export const addUser = (userData) => 
  axios.post(`${API_BASE}/admin/users`, userData);

export const addStore = (storeData) => 
  axios.post(`${API_BASE}/admin/stores`, storeData);

// Normal User APIs
export const getAllStoresForRating = () => 
  axios.get(`${API_BASE}/stores`);

export const submitRating = (ratingData) => 
  axios.post(`${API_BASE}/submitrating`, ratingData);

export const getMyRatings = () => 
  axios.get(`${API_BASE}/myrating`);

// Store Owner APIs
export const getOwnerDashboard = () => 
  axios.get(`${API_BASE}/owner/dashboard`);

export const getMyStore = () => 
  axios.get(`${API_BASE}/owner/mystore`);

export const getMyStoreRatings = () => 
  axios.get(`${API_BASE}/owner/myratings`);

// Common APIs
export const changePassword = (passwordData) => 
  axios.put(`${API_BASE}/changepassword`, passwordData);