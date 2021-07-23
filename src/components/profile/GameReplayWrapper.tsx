import CombinedContext from '../contexts/CombinedContext';
import GameReplay from './GameReplay';

const GameReplayWrapper = () => {
  return (
    <CombinedContext><GameReplay /></CombinedContext>
  );
};

export default GameReplayWrapper;