import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cachedUser = localStorage.getItem('user');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });

  // Setup an Axios interceptor to catch 401s (e.g. Django session expired)
  // and clear the local storage seamlessly, forcing a redirect by clearing the state.
  useEffect(() => {
    // Attempt to grab a CSRF cookie on initial mount so we're ready for POSTs
    api.get('/auth/csrf/').catch(() => {});

    const resInterceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // If the backend session says we are unauthorized, purge local cache cleanly
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

  const login = async (username, password) => {
    const res = await api.post('/auth/login/', { username, password });
    if (res.data && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (username, email, password, role) => {
    const res = await api.post('/auth/register/', { username, email, password, role });
    if (res.data && res.data.user) {
      // Typically, people may require explicit login but let's auto-login if the backend did not,
      // Wait, let's just ask them to login manually or auto-login by calling login
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
