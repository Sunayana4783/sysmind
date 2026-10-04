import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { authAPI, type AuthUser, type SignupData, type LoginData } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;       // true while validating the stored token on mount
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // starts true so we can validate before rendering routes

  // On mount: if a token exists in localStorage, verify it with the backend.
  // This is what keeps the user logged in after a page refresh.
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authAPI.getMe();
        setUser(response.data.user);
      } catch {
        // Token is invalid or expired — clear it
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  // Sign up: create account, then redirect (caller handles navigation)
  const signup = useCallback(async (data: SignupData) => {
    await authAPI.signup(data);
    // After signup we don't log the user in — they go to /login
  }, []);

  // Login: authenticate, store token, set user in state
  const login = useCallback(async (data: LoginData) => {
    const response = await authAPI.login(data);
    const { token, user: loggedInUser } = response.data;

    // Store the token in localStorage so it persists across refreshes
    localStorage.setItem('token', token);
    setUser(loggedInUser);
  }, []);

  // Logout: remove token and clear user state
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
};
