import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cachedUser = localStorage.getItem('user');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });

  useEffect(() => {
    api.get('/auth/csrf/').catch(() => {});

    const resInterceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          setUser(null);
          localStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(resInterceptor);
    };
  }, []);

  const login = async (email, password, role) => {
    const payload = { email, password };

    if (role) {
      payload.role = role;
    }

    const res = await api.post('/auth/login/', payload);
    if (res.data && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (username, email, password, role) => {
    const res = await api.post('/auth/register/', { username, email, password, role });
    if (res.data && res.data.user) {
      return res.data;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout/');
    } catch(err) {
      console.warn("Logout failed on server, logging out locally.");
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
