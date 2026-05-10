import { create } from 'zustand';

interface MenuItem {
  id: number;
  name: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}

interface AuthState {
  token: string | null;
  userId: string | null;
  username: string | null;
  realName: string | null;
  menus: MenuItem[];
  permissions: string[];
  setAuth: (data: {
    token: string;
    userId: string;
    username: string;
    realName: string;
    menus: MenuItem[];
    permissions: string[];
  }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  username: localStorage.getItem('username'),
  realName: localStorage.getItem('realName'),
  menus: JSON.parse(localStorage.getItem('menus') || '[]'),
  permissions: JSON.parse(localStorage.getItem('permissions') || '[]'),
  setAuth: ({ token, userId, username, realName, menus, permissions }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('realName', realName || '');
    localStorage.setItem('menus', JSON.stringify(menus));
    localStorage.setItem('permissions', JSON.stringify(permissions));
    set({ token, userId, username, realName, menus, permissions });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('realName');
    localStorage.removeItem('menus');
    localStorage.removeItem('permissions');
    set({ token: null, userId: null, username: null, realName: null, menus: [], permissions: [] });
  },
}));