import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useAuth() {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login/', credentials);
    localStorage.setItem('access_token', data.access);
    setUser(data.user);
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await api.get('/auth/me/');
        setUser(data);
      } catch (err) {
        localStorage.removeItem('access_token');
      }
    };
    loadUser();
  }, []);

  return { user, login };
}