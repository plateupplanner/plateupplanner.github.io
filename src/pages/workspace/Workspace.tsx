import { useState } from 'react';
import { Button } from '@mantine/core';
import { IconChefHat, IconGridDots, IconWall } from '@tabler/icons';
import { GridMode } from '../../utils/helpers';
import InfoModal from '../../components/modals/infoModal/InfoModal';
import TallyModal from '../../components/modals/tallyModal/TallyModal';
import Menu from '../../components/menu/Menu';
import NewPlanModal from '../../components/modals/newPlanModal/NewPlanModal';
import * as styled from './styled';
import ShareButton from '../../components/shareButton/ShareButton';
import Grids from '../../components/grids/Grids';

const Workspace = () => {
  const [showMenu, setShowMenu] = useState(true);
  const [mode, setMode] = useState(GridMode.Plan);

  return (
    <styled.WorkspaceSection>
      <styled.Content $showMenu={showMenu}>
        <styled.Topbar>
          <div>
            <NewPlanModal />
            <Button
              onClick={() => {
                setMode(mode === GridMode.Draw ? GridMode.Plan : GridMode.Draw);
              }}
              rightIcon={
                mode === GridMode.Draw ? <IconChefHat /> : <IconWall />
              }
              size='md'
              radius='xl'
            >
              {mode === GridMode.Draw ? 'Back to kitchen' : 'Add walls'}
            </Button>
          </div>
          <div>
            <InfoModal />
            <TallyModal />
            <ShareButton />
            <styled.MenuIcon
              $showMenu={showMenu}
              onClick={() => setShowMenu(!showMenu)}
              size='xl'
              radius='xl'
            >
              <IconGridDots stroke='2.5' size={20} />
            </styled.MenuIcon>
          </div>
        </styled.Topbar>
        <Grids mode={mode} />
      </styled.Content>
      <Menu mode={mode} showMenu={showMenu} />
    </styled.WorkspaceSection>
  );
};

export default Workspace;
