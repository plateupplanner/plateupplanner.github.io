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

  main {
    flex: 1;
  }

  &::selection {
    text-shadow: none;
    background: ${({ theme }) => theme.colors.brand};
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    color: ${({ theme }) => theme.colors.font};
    font-family: ${({ theme }) => theme.fonts.title};
    font-weight: 400;
  }

  h1 {
    font-size: 4.2rem;
    line-height: 1.5;
  }

  p {
    margin: 0;
  }

  button, a {
    color: ${({ theme }) => theme.colors.font};
    font-family: ${({ theme }) => theme.fonts.text};
  }

  input, .mantine-Input-input, .mantine-Modal-title {
    font-family: ${({ theme }) => theme.fonts.title};
    font-weight: 400;
  }

  .mantine-InputWrapper-label {
    color: ${({ theme }) => theme.colors.font};
    font-family: ${({ theme }) => theme.fonts.title};
    font-weight: 400;
  }

  .mantine-Button-root, .mantine-ActionIcon-root {
    border: 1px solid #d9d9d9;
    color: ${({ theme }) => theme.colors.font};
    background-color: ${({ theme }) => theme.colors.brand};
    font-family: ${({ theme }) => theme.fonts.title};
    font-weight: 400;
    font-size: 2.1rem;

    &:hover {
      color: ${({ theme }) => theme.colors.fontDark};
      background-color: ${({ theme }) => theme.colors.backgroundColorHover};
    }
  }

  .mantine-Modal-modal {
    color: ${({ theme }) => theme.colors.font};
    background: ${({ theme }) => theme.colors.backgroundColor};

    .mantine-Modal-header {
      max-width: 100%;
    }

    .mantine-Modal-close {
      border-radius: 9999px;
      border: 1px solid transparent;
      background-color: transparent;

      &:hover {
        background-color: ${({ theme }) => theme.colors.backgroundColorHover};
      }
    }
  }

  .mantine-Modal-title {
    width: 100%;
    text-align: center;
    font-size: 2.1rem;
    margin-left: 44px;
  }

  .draw-grid-container,
.plan-grid-container {
  height: 100%;
  width: 100%;
  padding: 5%;
}

.draw-grid,
.plan-grid {
  display: grid;
  max-height: 70vh; /* Account for buttons at the bottom */
  max-width: 66vw; /* Account for right menu */
  border: 1em solid black;
  margin: auto;
}

.plan-grid-bounding-box {
  max-height: 70vh; /* Account for buttons at the bottom */
  max-width: 66vw; /* Account for right menu */
  margin: auto;
}

.grid-selected {
  border: 5px solid cornflowerblue;
}

.grid-image {
  display: block;
  width: 100%;
  aspect-ratio: 1;
}

.line-empty-draw {
  background-color: lightsalmon;
}

.line-empty-plan {
  background-color: rgb(240, 240, 240);
}

.line-wall-draw,
.line-wall-plan {
  background-color: black;
}

.line-half-draw,
.line-half-plan {
  background-color: rgb(162, 85, 47);
}

`;
