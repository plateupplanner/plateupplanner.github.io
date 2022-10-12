import { ActionIcon, Button, HoverCard } from '@mantine/core';
import { useClipboard, useTimeout } from '@mantine/hooks';
import { IconLink, IconPhotoDown, IconShare } from '@tabler/icons';
import saveAs from 'file-saver';
import html2canvas from 'html2canvas';
import { useCallback, useState } from 'react';
import * as styled from './styled';

const ShareButton = () => {
  const [savingImage, setSavingImage] = useState(false);
  const { start, clear } = useTimeout(() => setSavingImage(false), 1500);
  const clipboard = useClipboard({ timeout: 1500 });

  const handleImageShare = useCallback(() => {
    clear();
    setSavingImage(true);
    start();
    html2canvas(document.querySelector('#plan-grid') as HTMLElement).then(
      (canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob as Blob, 'kitchen.png');
        });
      },
    );
  }, []);

  return (
    <HoverCard width={200} closeDelay={400} shadow='md'>
      <HoverCard.Target>
        <ActionIcon size='xl' radius='xl'>
          <IconShare stroke='2.5' size={20} />
        </ActionIcon>
      </HoverCard.Target>
      <styled.HoverCardDropdown>
        <Button
          onClick={() => handleImageShare()}
          leftIcon={<IconPhotoDown />}
          size='md'
          radius='xl'
        >
          {savingImage ? 'Saved image' : 'Save image'}
        </Button>
        <Button
          onClick={() => clipboard.copy(window.location.href)}
          leftIcon={<IconLink />}
          size='md'
          radius='xl'
        >
          {clipboard.copied ? 'Copied url' : 'Copy url'}
        </Button>
      </styled.HoverCardDropdown>
    </HoverCard>
  );
};

export default ShareButton;
