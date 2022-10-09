// styled.d.ts
import 'styled-components';
import { THEME } from '../theme';

declare module 'styled-components' {
  type Theme = typeof THEME;

  // This needs to be an interface to properly override the default theme
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
