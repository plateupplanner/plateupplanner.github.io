import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { NotificationsProvider } from '@mantine/notifications';
import { GlobalStyle } from './components/general/GlobalStyle';
import Home from './pages/home/Home';
import Workspace from './pages/workspace/Workspace';
import shallow from 'zustand/shallow';
import { useThemeStore } from './store/themeStore';

export const ROUTES = {
  HOME: '/',
  WORKSPACE: '/workspace',
};

const App = () => {
  const theme = useThemeStore((store) => store.theme, shallow);

  return (
    <ThemeProvider theme={theme}>
      <NotificationsProvider>
        <GlobalStyle />
        <main>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.WORKSPACE} element={<Workspace />} />
          </Routes>
        </main>
      </NotificationsProvider>
    </ThemeProvider>
  );
};

export default App;
