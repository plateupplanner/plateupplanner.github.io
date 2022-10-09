import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './components/general/GlobalStyle';
import Home from './pages/home/Home';
import Workspace from './pages/workspace/Workspace';
import { THEME } from './theme';

// TODO: Remove once antd is out, also infringes with styled components GlobalStyle!
import 'antd/dist/antd.min.css';

const App = () => {
  return (
    <ThemeProvider theme={THEME}>
      <GlobalStyle />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/workspace' element={<Workspace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
