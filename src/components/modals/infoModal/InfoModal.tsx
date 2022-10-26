import { useState } from 'react';
import { ActionIcon, Modal } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { IconQuestionMark } from '@tabler/icons';
import * as styled from './styled';

type Props = {
  className?: string;
};

const InfoModal = ({ className }: Props) => {
  const [opened, setOpened] = useState(false);
  useHotkeys([['shift + ?', () => setOpened(!opened)]]);
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
          <section>
            <p>
              We are not officially affiliated with PlateUp! or its creators. No
              copyright infringement intended. We just love the game ❤️
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
          </section>
          <section>
            <h3>Keyboard shortcuts</h3>
            <hr />
            <styled.KeyboardShortcutGrid>
              <div>
                <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd>
              </div>
              <span>select items</span>
              <div>
                <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>
              </div>
              <span>move selected item</span>
              <div>
                <kbd>Q</kbd> <kbd>E</kbd>
              </div>
              <span>rotate selected item left/right</span>
              <div>
                <kbd>CTRL+D</kbd>
              </div>
              <span>duplicate selected item</span>
              <div>
                <kbd>?</kbd>
              </div>
              <span>toggle info modal</span>
              <div>
                <kbd>/</kbd>
              </div>
              <span>search appliance</span>
              <div>
                <kbd>esc</kbd>
              </div>
              <span>exit search</span>
            </styled.KeyboardShortcutGrid>
          </section>
        </styled.InfoModal>
      </Modal>
    </>
  );
};

export default InfoModal;
