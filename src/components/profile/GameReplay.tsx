import { CircularProgress, Grid } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { Redirect, useHistory, useParams } from 'react-router';
import { backendURL } from '../../constants';
import { RevertDirection } from '../../redux/actions/game/definitions';
import { captureMoveHistoryEntry, moveMoveHistoryEntry, revert, startingGamePieces } from '../../redux/reducers/gameReducer';
import { AuthState, FullState, GamePieceState, MoveHistoryEntry } from '../../redux/state';
import { Logic } from '../contexts/LogicContext';
import Board from '../game/board/Board';
import Colors from '../game/board/constants/Colors';
import { ItemInterface } from '../game/board/Piece';
import Controls from '../game/Controls';
import MoveHistory from '../game/gamebar/moves/MoveHistory';
import PlayerBar from '../game/PlayerBar';
import { useGet } from '../game/hooks/useFetch';

const GameReplay = () => {
  const [pieces, setPieces] = useState<GamePieceState>(startingGamePieces);
  const [reverted, setReverted] = useState<number | null>(null);
  const [opponent, setOpponent] = useState<{username: string, score: number}>({username: 'opponent', score: 800});
  const [moveHistory, setMoveHistory] = useState<MoveHistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [side, setSide] = useState<Colors>(Colors.white);
  const params = useParams<{gameId: string}>();
  const history = useHistory();
  const fetch = useGet(backendURL+'/game/'+params.gameId);
  const { movePiece, getPieceByPosition } = useContext(Logic);
  const { username, score } = useSelector<FullState, AuthState>(state => state.auth);

  useEffect(() => {
    fetch().then((res) => {
      if((res as { error: string }).error) {
        alert(res.error);
        history.push('/profile');
        return;
      }

      const { side, opponent, moves } = res as { side: Colors, opponent: { username: string, score: number }, moves: {pieceId: string, target: number}[]};
      console.log(moves);
      setOpponent(opponent);
      setSide(side);
      let newState = pieces;
      let newMoveHistory = moveHistory;
      for(const { pieceId, target } of moves) {
        newState = movePiece(pieceId, target, pieces, false, false);
        for(const id of Object.keys(pieces)) {
          if(pieces[id].position !== newState[id].position) {
            if(newState[id].position === -1) {
              newMoveHistory = captureMoveHistoryEntry(newMoveHistory, id, pieces[id], newState[id]);
            } else {
              newMoveHistory = moveMoveHistoryEntry(newMoveHistory, id, pieces[id], newState[id]);
            }
          }
        }
      }
      setMoveHistory(newMoveHistory);
      setReverted(0);
      setLoading(false)
    }).catch(err => {
      alert(err);
      console.trace(err);
      history.push('/profile');
    })
  }, [])

  if(params.gameId === undefined) {
    return <Redirect to='/profile'/>;
  }

  const revertState = (direction: RevertDirection) => {
    const { pieces: revPieces, reverted: revReverted } = revert(moveHistory, reverted, pieces, direction);
    setPieces(revPieces);
    setReverted(revReverted);
  }

  return (
    <>
      <div className="container-horizontal">
        <div className="padding-16 full-height">
          <div className="container-vertical">
            <PlayerBar
              color={side === Colors.white ? Colors.black : Colors.white} 
              name={opponent.username} 
              score={opponent.score} 
            />
            <div className="box">
              <DndProvider backend={HTML5Backend}>
                <Board
                  promote={() => {}}
                  canBeDropped={() => false} 
                  movePiece={() => {}} 
                  getPieceByPosition={(position: number) => getPieceByPosition(position, pieces)}
                  side={side}
                />
              </DndProvider>
            </div>
            <PlayerBar 
              color={side} 
              name={username!} 
              score={score!} 
            />
          </div>
        </div>
        <div className="padding-16 full-height game-bar">
          <Grid container spacing={1} style={{height: '100%'}}>
            <Grid item xs={12} style={{height: '90%'}}>
              <MoveHistory end={reverted === null} moveHistory={reverted === null ? moveHistory : moveHistory.slice(0, reverted)} />
            </Grid>
            <Grid item xs={12} style={{height: '10%'}}>
              <Controls revert={revertState} />
            </Grid>
          </Grid>
        </div>
      </div>
      {loading && <div style={{display: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, .3)'}}><CircularProgress/></div>}
    </>
  );
};

export default GameReplay;