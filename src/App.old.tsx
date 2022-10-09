import { useState, KeyboardEvent, SetStateAction } from 'react';
import { InputNumber, Alert } from 'antd';
import { DoubleRightOutlined, WarningOutlined } from '@ant-design/icons';
import Workspace from './pages/workspace/Workspace';
import { decodeLayoutString } from './components/layout/Layout';
import { styledButton } from './utils/helpers';

import './App.css';
import 'antd/dist/antd.min.css';

function AppOld() {
  const maxHeight = 12;
  const maxWidth = 16;
  const defaultHeight = maxHeight;
  const defaultWidth = maxWidth;
  const [height, setHeight] = useState<number>(defaultHeight);
  const [width, setWidth] = useState<number>(defaultWidth);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [bypassWarning, setBypassWarning] = useState(false);
  const [importedLayoutString, setImportedLayoutString] = useState(
    window.location.hash,
  );

  const handleSubmit = () => {
    if (
      height !== undefined &&
      width !== undefined &&
      height > 0 &&
      width > 0 &&
      height <= maxHeight &&
      width <= maxWidth
    ) {
      setShowWorkspace(true);
    }
  };

  const handleReset = () => {
    window.location.hash = '';
    setImportedLayoutString('');
    setShowWorkspace(false);
    setHeight(defaultHeight);
    setWidth(defaultWidth);
  };

  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  let importedLayout = undefined;
  let layoutError = undefined;

  try {
    if (importedLayoutString.length > 1) {
      importedLayout = decodeLayoutString(importedLayoutString.slice(1));
    }
  } catch (e) {
    layoutError = (
      <Alert message='Invalid layout link' type='error' closable showIcon />
    );
  }

  if (isTouchDevice() && !bypassWarning) {
    return (
      <div
        className='app'
        onKeyDown={(event: KeyboardEvent) => {
          if (event.key === 'Enter') {
            handleSubmit();
          }
        }}
      >
        <div
          style={{
            font: "3em 'Lilita One', sans-serif",
            padding: '1em',
          }}
        >
          PlateUp! Planner
        </div>
        <div
          style={{
            font: "1em 'Source Sans Pro' 300, sans-serif",
            textAlign: 'center',
            paddingBottom: '2em',
          }}
        >
          Plan your PlateUp! kitchen before you jump into the game
          <br />
        </div>
        {layoutError}
        <div
          style={{
            font: "2em 'Source Sans Pro' 300 italic, sans-serif",
            textAlign: 'center',
            padding: '4em',
          }}
        >
          <WarningOutlined />
          <br />
          <p>Warning!</p>
          <i>
            PlateUp! Planner has not been implemented for touchscreen devices
            yet and will not work unless you have a mouse. Continue at your own
            risk!
          </i>
          <br />
          {styledButton(
            'Continue anyway',
            () => {
              setBypassWarning(true);
            },
            <DoubleRightOutlined />,
            true,
          )}
        </div>
      </div>
    );
  }

  if (importedLayout !== undefined) {
    return (
      <div className='app'>
        <Workspace
          height={importedLayout.height}
          width={importedLayout.width}
          handleResetParent={handleReset}
          importedLayout={importedLayout}
        />
      </div>
    );
  }

  if (showWorkspace) {
    return (
      <div className='app'>
        <Workspace
          height={height as number}
          width={width as number}
          handleResetParent={handleReset}
        />
      </div>
    );
  }

  return (
    <div
      className='app'
      onKeyDown={(event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          handleSubmit();
        }
      }}
    >
      <div
        style={{
          font: "3em 'Lilita One', sans-serif",
          padding: '1em',
        }}
      >
        PlateUp! Planner
      </div>
      <div
        style={{
          font: "1em 'Source Sans Pro' 300, sans-serif",
          textAlign: 'center',
          paddingBottom: '2em',
        }}
      >
        Plan your PlateUp! kitchen before you jump into the game
        <br />
      </div>
      {layoutError}
      <div className='dimensions'>
        <div className='header'>Height</div>
        <div />
        <div className='header'>Width</div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <InputNumber
            min={1}
            max={maxHeight}
            defaultValue={defaultHeight}
            onChange={(value: SetStateAction<number>) => setHeight(value)}
            style={{
              fontSize: '2em',
              padding: '5%',
            }}
          />
        </div>
        <div className='header'>x</div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <InputNumber
            min={1}
            max={maxWidth}
            defaultValue={defaultWidth}
            onChange={(value: SetStateAction<number>) => setWidth(value)}
            style={{
              fontSize: '2em',
              padding: '5%',
            }}
          />
        </div>
      </div>
      {styledButton('Start', handleSubmit)}
      <div
        style={{
          font: "1em 'Source Sans Pro' 300 italic, sans-serif",
          textAlign: 'center',
          padding: '4em',
        }}
      >
        <i>
          We are not officially affiliated with PlateUp! or its creators. No
          copyright infringement intended. We just love the game ♥
        </i>
      </div>
    </div>
  );
}

export default AppOld;
