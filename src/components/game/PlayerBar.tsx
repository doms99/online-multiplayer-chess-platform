import { Paper, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { FullState, GameState } from '../../redux/state';
import Colors from './board/constants/Colors';
import GameTimer from './GameTimer';

export interface Props {
  name: string,
  score: number,
  color: Colors,
  duration?: number,
  end?: (color: Colors) => void,
  counterRestartCallback?: (func: (time: number) => void) => void
}

const PlayerBar: React.FC<Props> = ({ name, score, color, duration, end, counterRestartCallback}) => {
  const { turn, winner, started } = useSelector<FullState, GameState>(state => state.game);
  return (
    <div className="wrapper">
      <Paper>
        <div className="player-bar">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <Typography>{name}</Typography>
              <Typography>{score}</Typography>
            </div>
            {duration && <Typography>
              <GameTimer 
                counterRestartCallback={counterRestartCallback} 
                running={started && color === turn && winner === null} 
                secunds={duration} 
                over={end ? () => end(Colors.black) : () => {}} 
              />
            </Typography>}
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default PlayerBar;