// src/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://contabia-backend.onrender.com', // podés usar process.env.REACT_APP_API_URL si querés externalizarlo
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;

