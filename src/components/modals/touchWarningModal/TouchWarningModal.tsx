import { useState } from 'react';
import { Button, Modal } from '@mantine/core';
import * as styled from './styled';
import { IconChevronsRight } from '@tabler/icons';

const TouchWarning = () => {
  const isTouchDevice =
    'ontouchstart' in window || window.navigator.maxTouchPoints > 0;

  const [opened, setOpened] = useState(isTouchDevice);

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title='Touch warning!'
    >
      <styled.TouchWarningModal>
        <p>
          PlateUp! Planner has not been implemented for touchscreen devices yet
          and will not work unless you have a mouse or keyboard. Continue at
          your own risk!
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
