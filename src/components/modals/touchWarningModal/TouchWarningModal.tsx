import { useState } from 'react';
import { Button, Modal } from '@mantine/core';
import * as styled from './styled';
import { IconChevronsRight } from '@tabler/icons';
import { isTouchDevice } from '../../../utils/helpers';

const TouchWarning = () => {
  const [opened, setOpened] = useState(isTouchDevice());

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title='Touch warning!'
    >
      <styled.TouchWarningModal>
        <p>
          PlateUp! Planner only has basic functionality for touchscreen devices
          right now so your experience may not be as good as it would be with a
          mouse or keyboard. Continue at your own risk!
        </p>
        <Button
          onClick={() => setOpened(false)}
          rightIcon={<IconChevronsRight />}
          radius='xl'
          size='md'
        >
          Continue
        </Button>
      </styled.TouchWarningModal>
    </Modal>
  );
};

export default TouchWarning;
