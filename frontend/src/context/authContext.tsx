import {
  createContext,
  useState,
  useContext,
  useLayoutEffect,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import axios, { type InternalAxiosRequestConfig } from 'axios';

interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (userData: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const api = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (userData: string, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', userData);
    // If userData is an object, use: localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use(
      (config: InternalAxiosRequestConfig & { _retry?: boolean }) => {
        if (!config._retry && token) {
          config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
      }
    );

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
