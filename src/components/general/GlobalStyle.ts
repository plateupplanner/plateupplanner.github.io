import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, ::after, ::before {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html,
  body {
    font-size: 62.5%;
  }

  body {
    min-height: 100vh;
    padding: 0;
    margin: 0;
    color: ${({ theme }) => theme.colors.font};
    font-size: 1.6rem;
    font-family: ${({ theme }) => theme.fonts.text};
    font-weight: 400;
    background: ${({ theme }) => theme.colors.backgroundColor};
    background-size: cover;
    background-position: center;
    background-repeat: repeat-y;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &::selection {
    text-shadow: none;
    background: ${({ theme }) => theme.colors.brand};
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.title};
  }

  h1 {
    font-size: 3.4rem;
    line-height: 1.5;
  }

  p {
    margin-top: 0;
  }

  button, a {
    color: ${({ theme }) => theme.colors.font};
    font-family: ${({ theme }) => theme.fonts.text};
  }
`;
