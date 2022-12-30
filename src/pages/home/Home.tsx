import { Button, NumberInput, Card } from '@mantine/core';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import shallow from 'zustand/shallow';
import { ROUTES } from '../../App';
import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  MAX_HEIGHT,
  MAX_WIDTH,
  useWorkspaceStore,
} from '../../store/workspaceStore';
import * as styled from './styled';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [width, height, setSize] = useWorkspaceStore(
    (state) => [state.width, state.height, state.setSize],
    shallow,
  );

  // Support for older links without routing
  useEffect(() => {
    if (location.hash) {
      navigate(`${ROUTES.WORKSPACE}${location.hash}`);
    }
  }, [location]);

  return (
    <styled.HomeSection>
      <styled.InfoModalButton />
      <h1>PlateUp! Planner</h1>
      <p>Plan your PlateUp! kitchen before you jump into the game</p>
      <styled.SizeInput>
        <NumberInput
          min={0}
          max={MAX_WIDTH}
          value={width}
          onChange={(width) => setSize({ width })}
          label='Width'
        />
        <NumberInput
          min={0}
          max={MAX_HEIGHT}
          value={height}
          onChange={(height) => setSize({ height })}
          label='Height'
        />
      </styled.SizeInput>
      <styled.SizeWarning
        style={{
          display:
            width > DEFAULT_WIDTH || height > DEFAULT_HEIGHT ? 'block' : 'none',
        }}
      >
        <Card.Section inheritPadding>
          <h3>Warning</h3>
        </Card.Section>
        <Card.Section inheritPadding>
          The height and width of your kitchen exceed the maximum allowed in the
          base (unmodded) game. If there are too many items in the grid,{' '}
          <strong>link sharing may be disabled</strong> as the URL will exceed
          the maximum allowed length.
        </Card.Section>
      </styled.SizeWarning>
      <Button component={Link} to={ROUTES.WORKSPACE} radius='xl' size='lg'>
        Start
      </Button>
    </styled.HomeSection>
  );
};

export default Home;
