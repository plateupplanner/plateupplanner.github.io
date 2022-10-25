import styled from 'styled-components';

export const MenuSection = styled.section<{
  showMenu: boolean;
  disabled: boolean;
}>`
  position: fixed;
  width: ${({ theme }) => theme.sizes.menuWidth};
  height: 100%;
  top: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.brand};
  transform: ${({ showMenu }) => `translateX(${showMenu ? 0 : '100%'})`};
  transition: transform 0.3s ease;

  opacity: ${({ disabled }) => disabled && 0.4};
  pointer-events: ${({ disabled }) => disabled && 'none'};

  .mantine-InputWrapper-root {
    margin: 16px 32px;

    input {
      font-family: ${({ theme }) => theme.fonts.text};
      font-weight: 700;
    }
  }
`;

export const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: 84px 84px 84px;
  gap: 8px;
  max-height: calc(100% - 42px - 16px - 16px - 16px);
  padding: 0 32px 0 32px;
  margin-bottom: 32px;
  overflow-y: auto;
  overflow-x: hidden;

  button {
    width: 84px;
    height: 84px;
    border: 1px solid transparent;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors.menuItem};

    &:hover {
      border: 1px solid ${({ theme }) => theme.colors.white};
    }

    img {
      width: 100%;
      height: 100%;
      padding: 8px 0;
      object-fit: cover;
      object-position: bottom;
    }
  }
`;
