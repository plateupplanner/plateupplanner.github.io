import { ActionIcon, Tooltip } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons';
import shallow from 'zustand/shallow';
import { useThemeStore } from '../../store/themeStore';

export const ThemeButton = () => {
  const [themeName, setPresetTheme] = useThemeStore(
    (store) => [store.name, store.setPresetTheme],
    shallow,
  );

  return (
    <>
      {themeName === 'Default' && (
        <Tooltip
          label='Dark mode'
          events={{ hover: true, focus: true, touch: true }}
        >
          <ActionIcon
            onClick={() => setPresetTheme('Dark')}
            size='xl'
            radius='xl'
          >
            <IconMoon stroke='2.5' size={20} />
          </ActionIcon>
        </Tooltip>
      )}
      {themeName === 'Dark' && (
        <Tooltip
          label='Light mode'
          events={{ hover: true, focus: true, touch: true }}
        >
          <ActionIcon
            onClick={() => setPresetTheme('Default')}
            size='xl'
            radius='xl'
          >
            <IconSun stroke='2.5' size={20} />
          </ActionIcon>
        </Tooltip>
      )}
    </>
  );
};
