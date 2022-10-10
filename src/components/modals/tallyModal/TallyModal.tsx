import { useState } from 'react';
import { ActionIcon, Modal } from '@mantine/core';
import { IconListNumbers } from '@tabler/icons';
import * as styled from './styled';

const TallyModal = () => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <ActionIcon onClick={() => setOpened(!opened)} size='xl' radius='xl'>
        <IconListNumbers stroke='2.5' size={20} />
      </ActionIcon>
      <Modal opened={opened} onClose={() => setOpened(false)} title='Tally'>
        <styled.TallyModal>
          <p>No items yet!</p>
        </styled.TallyModal>
      </Modal>
    </>
  );
};

export default TallyModal;
