import {
  ActionIcon,
  ActionIconProps,
  createPolymorphicComponent,
} from '@mantine/core';
import styled, { css } from 'styled-components';

export const WorkspaceSection = styled.section``;

export const Content = styled.div<{ showMenu: boolean }>`
  margin-right: ${({ theme, showMenu }) =>
    showMenu ? theme.sizes.menuWidth : 0};
  transition: all 0.3s ease;
`;

export const Topbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;

  > div {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;

const _MenuIcon: typeof ActionIcon = styled(ActionIcon)<{
  showMenu: boolean;
}>`
  ${({ theme, showMenu }) =>
    showMenu &&
    css`
      && {
        color: ${theme.colors.fontDark};
        background-color: ${theme.colors.backgroundColorHover};
      }
    `}
`;
export const MenuIcon = createPolymorphicComponent<
  'button',
  ActionIconProps & {
    showMenu: boolean;
  }
>(_MenuIcon);
