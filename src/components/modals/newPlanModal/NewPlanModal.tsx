import { useState } from 'react';
import { Button, Modal } from '@mantine/core';
import { IconChevronsLeft } from '@tabler/icons';
import * as styled from './styled';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import { ROUTES } from '../../../App';
import { useNavigate } from 'react-router-dom';
import { useLayoutStore } from '../../../store/layoutStore';

const NewPlanModal = () => {
  const navigate = useNavigate();
  const resetWorkspace = useWorkspaceStore((state) => state.resetWorkspace);
  const setLayout = useLayoutStore((state) => state.setLayout);
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpened(!opened);
        }}
        leftIcon={<IconChevronsLeft />}
        size='md'
        radius='xl'
      >
        New floor plan
      </Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title='Discard current floorplan?'
      >
        <styled.NewPlanModal>
          <p>
            Are you sure you want to start over? You will lose all your current
            progress.
          </p>
          <div>
            <Button
              onClick={() => {
                setOpened(false);
              }}
              size='md'
              radius='xl'
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                resetWorkspace();
                setLayout();
                navigate(ROUTES.HOME);
              }}
              size='md'
              radius='xl'
            >
              Yes
            </Button>
          </div>
        </styled.NewPlanModal>
      </Modal>
    </>
  );
};

export default NewPlanModal;
