import { Button, Card, CardActions, CardContent, Grid, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Events } from '../../connection/definitions';
import { SocketContext } from '../contexts/SocketContextComponent';
import { FullState, GameState } from '../../redux/state';

export interface Props {
  newGame: () => void
  restart: () => void
}

const ResultBoard: React.FC<Props> = ({ newGame, restart }) => {
  const [rematchRequested, setRematchRequested] = useState<'recieved' | 'sent' | null>(null);
  const { send, listen } = useContext(SocketContext);
  const { winner, mode, side } = useSelector<FullState, GameState>(state => state.game);

  useEffect(() => {
    const listener = () => {
      console.log('rematch')
      setRematchRequested('recieved');
    };

    listen(Events.REMATCH_REQUEST, listener);
  }, []);

  const acceptRematch = () => {
    send(Events.REMATCH_ANSWER, true);
  }

  const rematch = () => {
    send(Events.REMATCH_REQUEST);
    setRematchRequested('sent');
  }
    
  return (
    <Card>
        <CardContent style={{textAlign: 'center'}}>
          <Typography color="textPrimary">{winner === 'draw' ? 'Draw' : (winner === side ? 'You won' : 'You lost')}</Typography>  
          {rematchRequested === 'recieved' && <Typography variant="h5" color="textPrimary">Rematch requested</Typography>  }
        </CardContent>
        <CardActions>
          <Grid container spacing={1}>
            <Grid item xs={7}>
              <Button variant="contained" fullWidth color="primary" onClick={newGame}>New Game</Button>
            </Grid>
            <Grid item xs={5}>
              <Button variant="outlined" fullWidth disabled={!!rematchRequested} color="default" onClick={mode ==='multi' ? rematch : restart}>{mode ==='multi' ?'Rematch' : 'Restart'}</Button>
            </Grid>
            {rematchRequested === 'recieved' && <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={acceptRematch}>Accept rematch</Button>
            </Grid>}
          </Grid>
          
        </CardActions>
      </Card>
  );
};

export default ResultBoard;