import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'custom';

interface ThemeState {
  mode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light',
  setTheme: (mode) => set({ mode }),
  toggleTheme: () => set((state) => ({
    mode: state.mode === 'light' ? 'dark' : state.mode === 'dark' ? 'custom' : 'light'
  })),
}));