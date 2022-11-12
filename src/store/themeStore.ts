import { Theme } from 'styled-components';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { THEMES } from '../theme';

type ThemeStore = {
  name: string;
  theme: Theme;
  setPresetTheme: (name: string) => void;
};

export const useThemeStore = create(
  persist<ThemeStore>(
    (set) => ({
      name: THEMES[0].name,
      theme: THEMES[0].theme,
      setPresetTheme: (name) => {
        const theme = THEMES.find((t) => t.name === name)?.theme;
        if (theme) set({ name, theme });
      },
    }),
    {
      name: 'theme-config',
      version: 1,
      getStorage: () => localStorage,
      serialize: ({ state: { name }, version }) =>
        JSON.stringify({ version, state: { name } }),
      deserialize: (str) => {
        const value = JSON.parse(str);
        value.state.theme = THEMES.find(
          (t) => value.state.name === t.name,
        )?.theme;
        return value;
      },
    },
  ),
);
