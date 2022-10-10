import shallow from 'zustand/shallow';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ActionIcon, Button } from '@mantine/core';
import {
  IconAlertTriangle,
  IconChefHat,
  IconGridDots,
  IconWall,
} from '@tabler/icons';
import { showNotification } from '@mantine/notifications';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Serializer } from '../../lib/serializer';
import { Layout } from '../../components/layout/Layout';
import * as styled from './styled';
import { GridMode } from '../../utils/helpers';
import { DrawGrid, PlanGrid } from '../../components/grids/grids';
import InfoModal from '../../components/modals/infoModal/InfoModal';
import TallyModal from '../../components/modals/tallyModal/TallyModal';
import { Menu } from '../../components/menu/Menu';
import NewPlanModal from '../../components/modals/newPlanModal/NewPlanModal';
import { useLayoutStore } from '../../store/layoutStore';

const Workspace = () => {
  const location = useLocation();
  const [width, height] = useWorkspaceStore(
    (state) => [state.width, state.height],
    shallow,
  );
  const [layout, setLayout] = useLayoutStore(
    (state) => [state.layout, state.setLayout],
    shallow,
  );
  const [mode, setMode] = useState(GridMode.Plan);

  useEffect(() => {
    if (layout) {
      return;
    }

    if (location.hash) {
      try {
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
  }, [location]);

  return (
    <styled.WorkspaceSection>
      <styled.Topbar>
        <div>
          <NewPlanModal />
          <Button
            onClick={() => {
              setMode(mode === GridMode.Draw ? GridMode.Plan : GridMode.Draw);
            }}
            rightIcon={mode === GridMode.Draw ? <IconChefHat /> : <IconWall />}
            size='md'
            radius='xl'
          >
            {mode === GridMode.Draw ? 'Back to kitchen' : 'Add walls'}
          </Button>
        </div>
        <div>
          <InfoModal />
          <TallyModal />
          <ActionIcon size='xl' radius='xl'>
            <IconGridDots stroke='2.5' size={20} />
          </ActionIcon>
        </div>
      </styled.Topbar>
      {/* {mode === GridMode.Plan && (
        <PlanGrid
        // setLayoutParent={setLayout}
        // draggedMenuItem={draggedItem}
        // draggedMenuPosition={draggedPosition}
        // handleMenuDrag={handleMenuDragInGrid}
        // handleMenuDrop={handleMenuDropInGrid}
        // handleMenuDragAway={handleMenuDragOffGrid}
        // textInputInFocus={textInputInFocus}
        />
      )}
      {mode === GridMode.Draw && (
        <DrawGrid
        // setLayoutParent={setLayout}
        // handleStartPlan={handleStartPlan}
        />
      )} */}
      {/* <Menu
        active={mode === GridMode.Plan}
        // handleDrag={handleMenuDrag}
        // handleDragEnd={handleMenuDragEnd}
        // handleAddItem={handleAddItem}
        // setTextInputInFocus={setTextInputInFocus}
      /> */}
    </styled.WorkspaceSection>
  );
};

export default Workspace;
