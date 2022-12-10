import { TextInput, Tooltip, UnstyledButton } from '@mantine/core';
import { useHotkeys, getHotkeyHandler } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconSearch } from '@tabler/icons';
import {
  DragEvent,
  useRef,
  useCallback,
  useMemo,
  useState,
  TouchEvent,
} from 'react';
import shallow from 'zustand/shallow';
import { useLayoutRef, useLayoutStore } from '../../store/layoutStore';
import { useThemeStore } from '../../store/themeStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import {
  getTouchedPosition,
  GridMode,
  isSingleTouch,
  SquareType,
} from '../../utils/helpers';
import * as styled from './styled';

type Props = {
  showMenu?: boolean;
  mode: GridMode;
  setShowMenu?: React.Dispatch<React.SetStateAction<boolean>>;
};

const Menu = ({ showMenu = true, setShowMenu, mode }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [itemFocus, setItemFocus] = useState<number | null>(null);
  const [width, height] = useWorkspaceStore(
    (state) => [state.width, state.height],
    shallow,
  );
  const layoutRef = useLayoutRef([mode]);
  const theme = useThemeStore((store) => store.theme);
  const [
    setLayout,
    setDraggedItem,
    setDraggedPosition,
    handleDropInGrid,
    setSelectedCell,
  ] = useLayoutStore(
    (state) => [
      state.setLayout,
      state.setDraggedItem,
      state.setDraggedPosition,
      state.handleDropInGrid,
      state.setSelectedCell,
    ],
    shallow,
  );
  const searchRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<HTMLButtonElement[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

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

  const handleFocusSearch = () => {
    setShowMenu?.(true);
    setItemFocus(null);
    searchRef.current?.focus?.();
  };

  const handleUnfocusSearch = () => {
    if (itemFocus !== null) {
      itemRefs.current[itemFocus]?.blur();
    }
    setShowMenu?.(false);
    setItemFocus(null);
    searchRef.current?.blur();
  };

  const handleMenuNavigation = (
    e: React.KeyboardEvent<HTMLElement> | KeyboardEvent,
  ) => {
    e.stopPropagation();
    const current = itemFocus || 0;
    const numColumns =
      gridRef.current !== null
        ? getComputedStyle(gridRef.current)
            .getPropertyValue('grid-template-columns')
            .split(' ').length
        : 1;
    let newItemFocus = current;
    switch (e.key) {
      case 'ArrowUp':
        if (current < numColumns) {
          handleFocusSearch();
          return;
        } else {
          newItemFocus = Math.max(0, current - numColumns);
        }
        break;
      case 'ArrowLeft':
        newItemFocus = Math.max(0, current - 1);
        break;
      case 'ArrowDown':
        newItemFocus = Math.min(menuItems.length - 1, current + numColumns);
        break;
      case 'ArrowRight':
        newItemFocus = Math.min(menuItems.length - 1, current + 1);
        break;
    }
    setItemFocus(newItemFocus);
    setSelectedCell(undefined);
    itemRefs.current[newItemFocus]?.focus();
  };

  useHotkeys([
    ['/', handleFocusSearch],
    ['Escape', handleUnfocusSearch],
  ]);

  return (
    <styled.MenuSection disabled={mode === GridMode.Draw} showMenu={showMenu}>
      <TextInput
        ref={searchRef}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        onKeyDown={getHotkeyHandler([
          ['Escape', handleUnfocusSearch],
          [
            'ArrowDown',
            () => {
              setItemFocus(0);
              itemRefs.current[0]?.focus();
              setSelectedCell(undefined);
            },
          ],
        ])}
        icon={<IconSearch />}
        placeholder='Search for items to add'
        size='md'
      />
      <styled.ItemGrid
        ref={gridRef}
        onKeyDown={getHotkeyHandler([
          ['ArrowUp', handleMenuNavigation],
          ['ArrowLeft', handleMenuNavigation],
          ['ArrowDown', handleMenuNavigation],
          ['ArrowRight', handleMenuNavigation],
        ])}
      >
        {menuItems?.map((item, idx) => (
          <Tooltip
            key={item.id}
            label={item.getImageAlt()}
            events={{ hover: true, focus: true, touch: true }}
          >
            <UnstyledButton
              draggable
              ref={(ref: HTMLButtonElement) => (itemRefs.current[idx] = ref)}
              onClick={() => {
                handleAddItem(item);
                setItemFocus(idx);
                showNotification({
                  message: `+1 ${item.getImageAlt()}`,
                  autoClose: 800,
                  disallowClose: true,
                  styles: {
                    root: {
                      width: 'fit-content',
                      right: 0,
                      backgroundColor: theme.colors.backgroundColor,
                      '&::before': {
                        backgroundColor: theme.colors.backgroundColor,
                      },
                    },
                    description: { color: theme.colors.font },
                  },
                });
              }}
              onDrag={(event: DragEvent<HTMLButtonElement>) => {
                event.preventDefault();
                setDraggedItem(item);
              }}
              onDragEnd={(event: DragEvent<HTMLButtonElement>) => {
                event.preventDefault();
                handleDropInGrid();
              }}
              onTouchStart={(e: TouchEvent) => {
                e.preventDefault();
                setDraggedItem(item);
              }}
              onTouchMove={(e: TouchEvent) => {
                if (!isSingleTouch(e)) return;
                e.preventDefault();
                const [i, j] = getTouchedPosition(e);
                if (i >= 0 && j >= 0) {
                  setDraggedPosition(i, j);
                }
              }}
              onTouchEnd={() => handleDropInGrid()}
              onTouchCancel={() => handleDropInGrid()}
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
