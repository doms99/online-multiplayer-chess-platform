import { useContext, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Board from './board/Board';
import Colors from './board/constants/Colors';
import { Typography } from '@material-ui/core';
import GameSelect from "./GameSelect";
import PlayerBar from './PlayerBar';
import { useDispatch, useSelector } from 'react-redux';
import { AuthState, FullState, GameState } from '../../redux/state';
import Chat from './gamebar/chat/Chat';
import './Game.css';
import MoveHistory from './gamebar/moves/MoveHistory';
import { resetActionCreator, revertActionCreator, startActionCreator, winnerActionCreator } from '../../redux/actions/game/gameAction';
import ResultBoard from './ResultBoard';
import { SocketContext } from '../contexts/SocketContextComponent';
import { Events } from '../../connection/definitions';
import Controls from './Controls';
import { Logic } from '../contexts/LogicContext';
import { RevertDirection } from '../../redux/actions/game/definitions';

const counterRestart: Record<string, (time: number) => void> = {};

const Game: React.FC = () => {
  const { username, score } = useSelector<FullState, AuthState>(state => state.auth);
  const dispatch = useDispatch();
  const { started, winner, side, mode, opponent, pieces, moveHistory, reverted } = useSelector<FullState, GameState>(state => state.game);
  const { username: opponentUsername, score: opponentScore } = opponent;
  const { send, listen, disconnect } = useContext(SocketContext);

  const [duration, setDuration] = useState<number>(10*60);

  useEffect(() => {
    listen(Events.ELAPSED, (data: { me: number, other: number}) => {
      if(side === Colors.white) {
        if(counterRestart[Colors.white]) counterRestart[Colors.white](duration - data.me);
        if(counterRestart[Colors.black]) counterRestart[Colors.black](duration - data.other);
      } else {
        if(counterRestart[Colors.black]) counterRestart[Colors.black](duration - data.me);
        if(counterRestart[Colors.white]) counterRestart[Colors.white](duration - data.other);
      }
    })
  }, [duration, listen, side]);

  const end = (color: Colors) => {
    dispatch(winnerActionCreator(color));
  }

  const couterCallback = (func: (time: number) => void, color: Colors) => {
    counterRestart[color] = func;
  }

  const newGame = () => {
    reset();
    disconnect();
  }

  const reset = () => {
    for(let func of Object.values(counterRestart)) {
      console.log('call');
      func(duration);
    }
    dispatch(resetActionCreator());
  }

  const restart = () => {
    reset();
    dispatch(startActionCreator(side, mode, opponent));
  }

  const resign = () => {
    const winner = side === Colors.white ? Colors.black : Colors.white;
    
    if(mode === 'multi') {
      send(Events.RESIGN);
    }
    dispatch(winnerActionCreator(winner));
  }

  return (
  <>
    <div>
      <div className="container-horizontal">
        <div className="padding-16 full-height">
          <div className="container-vertical">
            {mode !== 'alone' ? <PlayerBar 
              counterRestartCallback={(func) => couterCallback(func, side === Colors.white ? Colors.black : Colors.white)}
              end={end}
              duration={duration}
              color={side === Colors.white ? Colors.black : Colors.white} 
              name={opponentUsername} 
              score={opponentScore} 
            /> : <PlayerBar 
                color={side === Colors.white ? Colors.black : Colors.white} 
                name={opponentUsername} 
                score={opponentScore} 
              />
            }
            <div style={{position: 'relative'}} className="box">
            <div style={{pointerEvents: 'none', marginLeft: '3px', marginTop: '-4%', position: 'absolute', height: '100%', display: 'flex', flexDirection: side === Colors.white ? 'column-reverse' : 'column', alignItems: 'center', justifyContent: 'space-around'}} >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => <Typography key={v}>{v}</Typography>)}
            </div> 
            <div style={{pointerEvents: 'none', marginLeft: '4%', position: 'absolute', bottom: 0, width: '100%', display: 'flex', flexDirection: side === Colors.white ? 'row' : 'row-reverse', alignItems: 'center', justifyContent: 'space-around'}} >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => <Typography key={v}>{String.fromCharCode(96+v)}</Typography>)}
            </div> 
            
              <DndProvider backend={HTML5Backend}>
                <Logic.Consumer>
                  {({canBeDropped, movePiece, getPieceByPosition, promote }) => (
                    <Board 
                      promote={promote}
                      canBeDropped={canBeDropped} 
                      movePiece={movePiece} 
                      getPieceByPosition={(position: number) => getPieceByPosition(position, pieces)}
                      side={side}
                    />
                  )}
                </Logic.Consumer>
              </DndProvider>
            </div>
            {mode !== 'alone' ? <PlayerBar 
              counterRestartCallback={(func) => couterCallback(func, side)}
              end={end}
              duration={duration}
              color={side} 
              name={username!} 
              score={score!} 
            /> : <PlayerBar 
                color={side} 
                name={username!} 
                score={score!} 
              />
            }
          </div>
        </div>
          {started ? (
            <div className="padding-16 full-height game-bar">
              <div style={{flexGrow: 1, marginBottom: '8px', maxHeight: mode === 'multi' ? 'calc(50% - 8px)' : 'calc(85% - 8px)'}}>
                <MoveHistory moveHistory={reverted === null ? moveHistory : moveHistory.slice(0, reverted)} />
              </div>
              <div>
                <Controls resign={resign} resignDisabled={!!winner} revert={(direction: RevertDirection) => dispatch(revertActionCreator(direction))} />
              </div>
              {mode === 'multi' && <div style={{flexGrow: 1, marginTop: '8px', maxHeight: 'calc(40% - 8px)'}}>
                <Chat />
              </div>}
            </div>
          ) : (
            <div className="padding-16 game-select">
              <GameSelect duration={duration} setDuration={setDuration}/>
            </div>
          )}
      </div>
    </div>
      
    {winner && <div className="result">
      <ResultBoard newGame={newGame} restart={restart} />
    </div>}
  </>
  );
};

export default Game;