import { TextInput, Tooltip, UnstyledButton } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import { DragEvent, useMemo, useState } from 'react';
import shallow from 'zustand/shallow';
import { useLayoutStore } from '../../store/layoutStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { SquareType } from '../../utils/helpers';
import * as styled from './styled';

type Props = {
  showMenu?: boolean;
};

const Menu = ({ showMenu = true }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [width, height] = useWorkspaceStore(
    (state) => [state.width, state.height],
    shallow,
  );
  const [layout, setLayout, setDraggedItem, handleDropInGrid] = useLayoutStore(
    (state) => [
      state.layout,
      state.setLayout,
      state.setDraggedItem,
      state.handleDropInGrid,
    ],
    shallow,
  );

  const menuItems = useMemo(
    () =>
      SquareType.getAllItems().filter((item) =>
        item.getImageAlt().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  );

  const handleAddItem = (squareType: SquareType) => {
    const newLayout = layout?.clone();
    for (let i = 0; i < height * 2 - 1; i++) {
      for (let j = 0; j < width * 2 - 1; j++) {
        if (newLayout?.layout[i][j] === SquareType.Empty) {
          newLayout?.setElement(i, j, squareType);
          setLayout(newLayout);
          return;
        }
      }
    }
  };

  return (
    <styled.MenuSection showMenu={showMenu}>
      <TextInput
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        icon={<IconSearch color='black' />}
        placeholder='Search for items to add'
        size='md'
      />
      <styled.ItemGrid>
        {menuItems?.map((item) => (
          <Tooltip key={item.id} label={item.getImageAlt()}>
            <UnstyledButton
              draggable
              onClick={() => {
                handleAddItem(item);
              }}
              onDrag={(event: DragEvent<HTMLButtonElement>) => {
                event.preventDefault();
                setDraggedItem(item);
              }}
              onDragEnd={(event: DragEvent<HTMLButtonElement>) => {
                event.preventDefault();
                handleDropInGrid();
              }}
              style={{
                order: item.getOrder(),
              }}
            >
              <img src={item.getImageMenuPath()} alt={item.getImageAlt()} />
            </UnstyledButton>
          </Tooltip>
        ))}
      </styled.ItemGrid>
    </styled.MenuSection>
  );
};

export default Menu;
