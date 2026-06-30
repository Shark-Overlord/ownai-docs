import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest, getStoredToken, postJson, setStoredToken } from './api';

export type LoginUser = {
  id: number;
  userAccount?: string;
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
  userRole?: string;
  token?: string;
};

export type LoginCaptcha = {
  captchaId: string;
  imageBase64?: string;
  imageUrl?: string;
};

type AuthContextValue = {
  user: LoginUser | null;
  loading: boolean;
  login: (params: {
    userAccount: string;
    userPassword: string;
    captchaId?: string;
    captchaCode?: string;
  }) => Promise<void>;
  register: (params: {
    userAccount: string;
    userPassword: string;
    checkPassword: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginUser | null>(null);
  const [loading, setLoading] = useState(Boolean(getStoredToken()));

  async function refreshUser() {
    if (!getStoredToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const loginUser = await apiRequest<LoginUser>('/user/get/login');
      setUser(loginUser);
    } catch {
      setStoredToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshUser();
  }, []);

  async function login(params: {
    userAccount: string;
    userPassword: string;
    captchaId?: string;
    captchaCode?: string;
  }) {
    const loginUser = await postJson<LoginUser>('/user/login', params);
    setStoredToken(loginUser.token || null);
    setUser(loginUser);
  }

  async function register(params: {
    userAccount: string;
    userPassword: string;
    checkPassword: string;
  }) {
    await postJson<number>('/user/register', params);
  }

  async function logout() {
    try {
      await postJson<boolean>('/user/logout');
    } finally {
      setStoredToken(null);
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}

export function getLoginCaptcha() {
  return apiRequest<LoginCaptcha>('/user/login/captcha');
}
