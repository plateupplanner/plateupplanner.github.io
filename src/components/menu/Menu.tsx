import { TextInput, Tooltip, UnstyledButton } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import { DragEvent, useMemo, useState } from 'react';
import { SquareType } from '../../utils/helpers';
import * as styled from './styled';

type Props = {
  showMenu?: boolean;
  handleDrag: (squareType: SquareType) => void;
  handleDragEnd: () => void;
  handleAddItem: (squareType: SquareType) => void;
};

const Menu = ({
  showMenu = true,
  handleDrag,
  handleDragEnd,
  handleAddItem,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('');

  const menuItems = useMemo(
    () =>
      SquareType.getAllItems().filter((item) =>
        item.getImageAlt().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  );

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
                handleDrag(item);
              }}
              onDragEnd={(event: DragEvent<HTMLButtonElement>) => {
                event.preventDefault();
                handleDragEnd();
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
