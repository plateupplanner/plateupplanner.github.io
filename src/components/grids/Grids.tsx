import { showNotification } from '@mantine/notifications';
import { IconAlertTriangle } from '@tabler/icons';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import shallow from 'zustand/shallow';
import { Serializer } from '../../lib/serializer';
import { useLayoutStore } from '../../store/layoutStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { GridMode } from '../../utils/helpers';
import { Layout } from '../layout/Layout';
import DrawGrid from './DrawGrid';
import PlanGrid from './PlanGrid';

type Props = {
  mode?: GridMode;
};

const Grids = ({ mode }: Props) => {
  const location = useLocation();
  const [width, height, setSize] = useWorkspaceStore(
    (state) => [state.width, state.height, state.setSize],
    shallow,
  );
  const [layout, setLayout] = useLayoutStore(
    (state) => [state.layout, state.setLayout],
    shallow,
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted) {
      return;
    }

    setIsMounted(true);
    if (location.hash) {
      try {
        const newLayout = Serializer.decodeLayoutString(location.hash);
        setSize({ width: newLayout.width, height: newLayout.height });
        setLayout(Serializer.decodeLayoutString(location.hash));
      } catch (e) {
        setLayout(new Layout(height, width));
        showNotification({
          id: 'layout-invalid',
          title: 'Oops something went wrong',
          message: 'Your layout link is invalid',
          color: 'red',
          icon: <IconAlertTriangle size={20} />,
          autoClose: 10000,
        });
      }
    } else {
      setLayout(new Layout(height, width));
    }
  }, [location, height, width]);

  useEffect(() => {
    if (layout) {
      const layoutString = Serializer.encodeLayoutString(layout);
      window.history.replaceState(
        {
          ...window.history.state,
          as: '#' + layoutString,
          url: '#' + layoutString,
        },
        '',
        '#' + layoutString,
      );
    }
  }, [layout]);

  return (
    <>
      {mode === GridMode.Plan && <PlanGrid />}
      {mode === GridMode.Draw && <DrawGrid />}
    </>
  );
};

export default Grids;
