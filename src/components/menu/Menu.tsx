import { TextInput, Tooltip, UnstyledButton } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import { DragEvent, useCallback, useMemo, useState } from 'react';
import shallow from 'zustand/shallow';
import { useLayoutRef, useLayoutStore } from '../../store/layoutStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { GridMode, SquareType } from '../../utils/helpers';
import * as styled from './styled';

type Props = {
  showMenu?: boolean;
  mode: GridMode;
};

const Menu = ({ showMenu = true, mode }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [width, height] = useWorkspaceStore(
    (state) => [state.width, state.height],
    shallow,
  );
  const layoutRef = useLayoutRef([mode]);
  const [setLayout, setDraggedItem, handleDropInGrid] = useLayoutStore(
    (state) => [state.setLayout, state.setDraggedItem, state.handleDropInGrid],
    shallow,
  );

  const menuItems = useMemo(
    () =>
      SquareType.getAllItems().filter((item) =>
        item.getImageAlt().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  );

  const handleAddItem = useCallback((squareType: SquareType) => {
    for (let i = 0; i < height * 2 - 1; i++) {
      for (let j = 0; j < width * 2 - 1; j++) {
        const newLayout = layoutRef.current.clone();
        if (newLayout?.layout[i][j] === SquareType.Empty) {
          newLayout?.setElement(i, j, squareType.clone());
          setLayout(newLayout);
          return;
        }
      }
    }
  }, []);

  return (
    <styled.MenuSection disabled={mode === GridMode.Draw} showMenu={showMenu}>
      <TextInput
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        icon={<IconSearch />}
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
