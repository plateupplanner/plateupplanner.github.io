import { Menu } from '@mantine/core';
import styled from 'styled-components';

export const MenuDropdown = styled(Menu.Dropdown)`
  background-color: transparent;
  border: 0;
  box-shadow: none;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
`;
