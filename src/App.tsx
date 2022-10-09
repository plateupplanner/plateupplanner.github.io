import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Footer from './components/footer/Footer';
import { GlobalStyle } from './components/general/GlobalStyle';
import Home from './pages/home/Home';
import Workspace from './pages/workspace/Workspace';
import { THEME } from './theme';
import TouchWarning from './components/touchWarning/TouchWarning';

// TODO: Remove once antd is out, also infringes some styling
import 'antd/dist/antd.min.css';
export const ROUTES = {
  HOME: '/',
  WORKSPACE: '/workspace',
};

const App = () => {
  return (
    <ThemeProvider theme={THEME}>
      <GlobalStyle />
      <TouchWarning />
      <main>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.WORKSPACE} element={<Workspace />} />
        </Routes>
      </main>
      <Footer />
    </ThemeProvider>
  );
};

export default App;
