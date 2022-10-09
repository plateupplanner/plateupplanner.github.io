import shallow from 'zustand/shallow';
import { useWorkspaceStore } from '../../store/workspaceStore';

const Home = () => {
  const [width, height] = useWorkspaceStore(
    (state) => [state.width, state.height],
    shallow,
  );

  return (
    <>
      <h1>PlateUp! Planner</h1>
      <p>Plan your PlateUp! kitchen before you jump into the game</p>
    </>
  );
};

export default Home;
