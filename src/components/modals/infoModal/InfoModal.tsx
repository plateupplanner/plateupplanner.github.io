import { useState } from 'react';
import { ActionIcon, Modal } from '@mantine/core';
import { IconQuestionMark } from '@tabler/icons';
import * as styled from './styled';

type Props = {
  className?: string;
};

const InfoModal = ({ className }: Props) => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <ActionIcon
        className={className}
        onClick={() => setOpened(!opened)}
        size='xl'
        radius='xl'
      >
        <IconQuestionMark stroke='2.5' size={20} />
      </ActionIcon>
      <Modal opened={opened} onClose={() => setOpened(false)} title='Info'>
        <styled.InfoModal>
          <p>
            We are not officially affiliated with PlateUp! or its creators. No
            copyright infringement intended. We just love the game ♥
          </p>
          <p>
            🐞 If you would like to report a bug, please open an issue on our{' '}
            <a
              href='https://github.com/plateupplanner/plateupplanner.github.io/issues'
              target='_blank'
              rel='noopener noreferrer'
            >
              GitHub repo
            </a>
            .
          </p>
          <p>
            🎁 If you are interested in contributing to this project, please
            join{' '}
            <a
              href='https://discord.gg/hqy2YmQbyf'
              target='_blank'
              rel='noopener noreferrer'
            >
              our Discord server
            </a>
            .
          </p>
        </styled.InfoModal>
      </Modal>
    </>
  );
};

export default InfoModal;
