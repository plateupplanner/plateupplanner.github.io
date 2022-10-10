import { useMemo, useState } from 'react';
import { ActionIcon, Modal } from '@mantine/core';
import { IconListNumbers } from '@tabler/icons';
import { useLayoutStore } from '../../../store/layoutStore';
import * as styled from './styled';
import { SquareType } from '../../../utils/helpers';

type TallyItem = {
  name: string;
  path: string;
  count: number;
};

const TallyModal = () => {
  const [opened, setOpened] = useState(false);
  const layout = useLayoutStore((state) => state.layout);

  const tallyItems = useMemo(() => {
    if (!layout?.elements) {
      return null;
    }

    return layout.elements.reduce<{
      [key: string]: TallyItem;
    }>((result, currentItem) => {
      if (currentItem !== SquareType.Empty) {
        return {
          ...result,
          [currentItem.id]: {
            name: currentItem.getImageAlt(),
            path: currentItem.getImageMenuPath(),
            count: (result?.[currentItem.id]?.count ?? 0) + 1,
          },
        };
      } else {
        return result;
      }
    }, {});
  }, [layout]);

  return (
    <>
      <ActionIcon onClick={() => setOpened(!opened)} size='xl' radius='xl'>
        <IconListNumbers stroke='2.5' size={20} />
      </ActionIcon>
      <Modal opened={opened} onClose={() => setOpened(false)} title='Tally'>
        <styled.TallyModal>
          <>
            {!tallyItems && <p>No items yet!</p>}
            {tallyItems &&
              Object.keys(tallyItems).map((key) => {
                const item = tallyItems[key];
                return (
                  <div key={item.name}>
                    <span>{item.count}</span>
                    <img src={item.path} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                );
              })}
          </>
        </styled.TallyModal>
      </Modal>
    </>
  );
};

export default TallyModal;
