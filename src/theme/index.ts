/*
  Fonts used:
  Lilita One 400
  Source Sans Pro 300 italic
  Source Sans Pro 300 
*/

export const DEFAULT_THEME = {
  colors: {
    white: '#ffffff',
    black: '#000000',
    font: '#ffffff',
    fontDark: '#000000',
    brand: '#546785',
    backgroundColor: '#13284a',
    backgroundColorHover: '#f8f9fa',
    menuItem: '#8894AA',
    borderColor: '#d9d9d9',
    halfWall: '#a2552f',
    emptyPlan: '#f0f0f0',
    backgroundNoWall: '#8894AA',
  },
  emptyTile: {
    background: 'repeating-conic-gradient(#f5f5f5 0% 25%, #fefefe 0% 50%) 50%',
    backgroundSize: '33% 33%',
  },
  draw: {
    filter: 'grayscale(100%) contrast(40%) brightness(130%)',
    wallFilter: 'brightness(70%)',
  },
  fonts: {
    text: '"Source Sans Pro", sans-serif',
    title: '"Lilita One", sans-serif',
  },
  sizes: {
    menuWidth: '332px',
  },
};

type Theme = typeof DEFAULT_THEME;

export const THEMES: { name: string; theme: Theme }[] = [
  { name: 'Default', theme: DEFAULT_THEME },
  {
    name: 'Dark',
    theme: {
      ...DEFAULT_THEME,
      colors: {
        ...DEFAULT_THEME.colors,
        black: '#275296',
        halfWall: '#a2552f',
        emptyPlan: '#0f0f0f',
        backgroundNoWall: '#333333',
      },
      emptyTile: {
        background:
          'repeating-conic-gradient(#0a0a0a 0% 25%, #010101 0% 50%) 50%',
        backgroundSize: '33% 33%',
      },
      draw: {
        ...DEFAULT_THEME.draw,
        filter: 'grayscale(100%) contrast(40%)',
      },
    },
  },
];
