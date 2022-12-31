import { ActionIcon, Button, Menu, Tooltip, Text } from '@mantine/core';
import { useClipboard, useTimeout } from '@mantine/hooks';
import { IconLink, IconPhotoDown, IconShare } from '@tabler/icons';
import saveAs from 'file-saver';
import html2canvas from 'html2canvas';
import { useCallback, useEffect, useState } from 'react';
import * as styled from './styled';

const ShareButton = () => {
  const [urlHash, setUrlHash] = useState(window.location.hash);
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

  useEffect(() => {
    setUrlHash(window.location.hash);
  }, [urlHash]);

  return (
    <Menu width={200} shadow='md'>
      <Menu.Target>
        <ActionIcon size='xl' radius='xl'>
          <IconShare stroke='2.5' size={20} />
        </ActionIcon>
      </Menu.Target>
      <styled.MenuDropdown>
        <Button
          onClick={() => handleImageShare()}
          leftIcon={<IconPhotoDown />}
          size='md'
          radius='xl'
        >
          {savingImage ? 'Saved image' : 'Save image'}
        </Button>
        <Tooltip
          disabled={urlHash.length > 1}
          position='bottom'
          width={200}
          multiline
          label={
            <Text align='center'>
              Link sharing has been disabled because there are too many items,
              and we are unable to fit the information into the URL. Please
              remove some items and try again, or save the image instead.
            </Text>
          }
        >
          <Button
            onClick={() => clipboard.copy(window.location.href)}
            disabled={urlHash.length <= 1}
            leftIcon={<IconLink />}
            size='md'
            radius='xl'
          >
            {clipboard.copied ? 'Copied url' : 'Copy url'}
          </Button>
        </Tooltip>
      </styled.MenuDropdown>
    </Menu>
  );
};

export default ShareButton;
