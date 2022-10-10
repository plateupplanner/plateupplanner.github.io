import { Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { NotificationsProvider } from '@mantine/notifications';
import Footer from './components/footer/Footer';
import { GlobalStyle } from './components/general/GlobalStyle';
import Home from './pages/home/Home';
import Workspace from './pages/workspace/Workspace';
import { THEME } from './theme';
import TouchWarning from './components/modals/touchWarningModal/TouchWarningModal';

export const ROUTES = {
  HOME: '/',
  WORKSPACE: '/workspace',
};

const App = () => {
  const location = useLocation();

  return (
    <ThemeProvider theme={THEME}>
      <NotificationsProvider>
        <GlobalStyle />
        <TouchWarning />
        <main>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.WORKSPACE} element={<Workspace />} />
          </Routes>
        </main>
        {location.pathname === ROUTES.HOME && <Footer />}
      </NotificationsProvider>
    </ThemeProvider>
  );
};

export default App;
