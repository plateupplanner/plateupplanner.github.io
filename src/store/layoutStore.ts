import create from 'zustand';
import { Layout } from '../components/layout/Layout';

type LayoutStore = {
  layout: Layout | null;
  setLayout: (layout: Layout) => void;
};

export const useLayoutStore = create<LayoutStore>(() => ({
  layout: null,
  setLayout: () => {},
}));
