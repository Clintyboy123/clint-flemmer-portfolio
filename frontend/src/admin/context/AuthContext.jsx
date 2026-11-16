import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/http';
import * as auth from '../services/auth';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

// status: 'checking' while GET /auth/me runs, then 'signed-in' or 'signed-out'.
export function AuthProvider({ children }) {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('checking');
  const signedIn = useRef(false);

  useEffect(() => {
    let active = true;
    auth
      .getMe()
      .then((data) => {
        if (!active) return;
        setUser(data.user);
        setStatus('signed-in');
      })
      .catch(() => active && setStatus('signed-out'));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    signedIn.current = status === 'signed-in';
  }, [status]);

  // A 401 from any later call means the session has ended: back to the login page.
  useEffect(() => {
    const id = api.interceptors.response.use(undefined, (error) => {
      if (error.status === 401 && signedIn.current) {
        signedIn.current = false;
        setUser(null);
        setStatus('signed-out');
        toast.error('Your session has ended. Please sign in again.');
      }
      return Promise.reject(error);
    });
    return () => api.interceptors.response.eject(id);
  }, [toast]);

  const login = useCallback(async (values) => {
    const data = await auth.login(values);
    setUser(data.user);
    setStatus('signed-in');
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    signedIn.current = false;
    try {
      await auth.logout();
    } finally {
      setUser(null);
      setStatus('signed-out');
    }
  }, []);

  const value = useMemo(() => ({ user, status, login, logout }), [user, status, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
