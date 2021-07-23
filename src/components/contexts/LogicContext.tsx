import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { moveActionCreator, checkActionCreator, winnerActionCreator, captureActionCreator, startActionCreator, drawActionCreator, promoteActionCreator, turnActionCreator } from '../../redux/actions/game/gameAction';
import { FullState, GamePieceState, GameState, Opponent, PieceGameData } from '../../redux/state';
import Colors from '../game/board/constants/Colors';
import PieceTypes from '../game/board/constants/PieceTypes';
import { SocketContext } from './SocketContextComponent';
import { Events } from '../../connection/definitions';
import { capturePieces, movePieces as movePiecesReturn } from '../../redux/reducers/gameReducer';
import { scoreActionCreator } from '../../redux/actions/auth/authAction';
import { Game } from 'js-chess-engine'
let game: any = null;

const positionToIndex = (position: string): number => {
  if(position.length !== 2) return -1;

  const column = position.charCodeAt(0)-65;
  const row = 8 - parseInt(position.charAt(1));

  return row * 8 + column;
}

const indexToPosition = (index: number): string => {
  if(index < 0 || index > 63) return 'error';

  const column = index % 8;
  const row = 8 - Math.floor(index / 8);
  return `${String.fromCharCode(65+column)}${row}`;
} 

export interface LogicInterface {
  canBeDropped: (pieceId: string, target: number) => boolean,
  movePiece: (pieceId: string, target: number, state?: GamePieceState, emit?: boolean, dispatchMove?: boolean) => GamePieceState,
  getPieceByPosition: (position: number, state: GamePieceState) => PieceGameData | null,
  promote: (pieceId: string, type: PieceTypes) => void
}

export const Logic = createContext<LogicInterface>({} as LogicInterface);

const LogicContext: React.FC = ({ children }) => {
  const { started, pieces, turn, reverted, mode, side, winner } = useSelector<FullState, GameState>(state => state.game);
  const [movableSqares, setMovableSquares] = useState<{id: string, squares: number[]}[]>([]);
  const dispatch = useDispatch();
  const { send, listen } = useContext(SocketContext);

  const movePiece = useCallback((pieceId: string, target: number, state: GamePieceState, emit: boolean = true, dispatchMove: boolean = true, notifyEngine: boolean = true) => {
    const piece = state[pieceId];
    console.log(indexToPosition(piece.position), indexToPosition(target))
    
    if(emit && mode === 'multi') {
      send(Events.MOVE, {pieceId, target});
    }

    let newState: GamePieceState = {...state};

    const capturePiece = getPieceByPosition(target, newState);
    if(!!capturePiece) {
      if(dispatchMove) {
        dispatch(captureActionCreator(capturePiece.id));
      }
      console.log('capture', capturePiece);
      newState = capturePieces(newState, capturePiece.id);
    }

    const engineState = game.exportJson();
    if(piece.type === PieceTypes.pawn && !!engineState.enPassant && indexToPosition(target) === engineState.enPassant) {
      const capturePiece = turn === Colors.white ? getPieceByPosition(target+8, pieces) : getPieceByPosition(target-8, pieces);
      if(dispatchMove) {
        dispatch(captureActionCreator(capturePiece!.id));
      }
      newState = capturePieces(newState, capturePiece!.id);
    } else if(piece.type === PieceTypes.king && 
      Math.abs(target - piece.position) === 2 && 
      engineState.castling[`${piece.color.toLowerCase()}${target > piece.position ? 'Short' : 'Long'}`]
    ) {
      let rookPos;
      if(target > piece.position) rookPos = target + 1;
      else rookPos = target - 2;

      const rook = getPieceByPosition(rookPos, newState);

      const newPos = target > piece.position ? target - 1 : target + 1;

      if(dispatchMove) {
        dispatch(moveActionCreator(rook!.id, newPos));
      }
      newState = movePiecesReturn(newState, rook!.id, newPos);
    }
    
    if(dispatchMove) {
      dispatch(moveActionCreator(piece.id, target));
      dispatch(turnActionCreator());
    }
    newState = movePiecesReturn(newState, piece.id, target);
    if(notifyEngine) {
      game.move(indexToPosition(state[pieceId].position), indexToPosition(target));
      console.log(game.exportJson())
    }

    return newState;
  }, [dispatch, mode, pieces, send, turn]);
  
  const canDrop = (pieceId: string, target: number, state: GamePieceState): boolean => {
    if(mode !== 'alone' && turn !== side) return false;
    if(reverted !== null) return false; 

    // if(game === null) {
    //   game = new Game();
    // }


    for(const entry of movableSqares) {
      if(entry.id === pieceId) return entry.squares.includes(target);
    }

    const entry = {id: pieceId, squares: game.moves(indexToPosition(state[pieceId].position)).map((s: string) => positionToIndex(s))};
    setMovableSquares(current => [...current, entry]);
    return entry.squares.includes(target);
  }
  
  const getPieceByPosition = (position: number, state: GamePieceState): PieceGameData | null => {
    for(let piece of Object.values(state)) {
      if(piece.position === position) {
        return piece;
      }
    }
  
    return null;
  }

  const promote = (pieceId: string, type: PieceTypes) => {
    dispatch(promoteActionCreator(pieceId, type));
    send(Events.PROMOTE, {pieceId, type});
    const pos = indexToPosition(pieces[pieceId].position);
    game.removePiece(pos);
    game.setPiece(pos, pieces[pieceId].color === Colors.white ? type.charAt(0).toUpperCase() : type.charAt(0).toLowerCase());
  }

  let select = null;

  useEffect(() => {
    listen(Events.MOVE, (data: {pieceId: string, target: number}) => {
      movePiece(data.pieceId, data.target, pieces, false);
    });

    listen(Events.WINNER, () => {
      dispatch(winnerActionCreator(side));
    });

    listen(Events.RECONNECT_DATA, (data: {side: Colors, opponent: Opponent, moves: {pieceId: string, target: number}[]}) => {
      dispatch(startActionCreator(data.side, 'multi', data.opponent));
      let state = pieces;
      for(const move of data.moves) {
        state = movePiece(move.pieceId, move.target, state, false);
      }
    });

    listen(Events.PROMOTE, (data: {pieceId: string, type: PieceTypes}) => {
      dispatch(promoteActionCreator(data.pieceId, data.type!));
    });

    listen(Events.SCORE, (score: number) => {
      dispatch(scoreActionCreator(score));
    });
  }, [side, dispatch, listen, pieces, movePiece]);

  useEffect(() => {
    if(started && !winner) {
      game = new Game();
    }
  }, [started, winner]);

  useEffect(() => {
    if(winner && game) {
      game = null;
    }
  }, [winner]);

  useEffect(() => {
    setMovableSquares([]);
  }, [turn]);

  useEffect(() => {
    if(game === null) return;

    const state = game.exportJson();

    if(state.check) {
      dispatch(checkActionCreator(turn));
    }

    if(state.checkMate) {
      dispatch(winnerActionCreator(turn === Colors.white ? Colors.black : Colors.white));

      return;
    }

    if(state.isFinished) {
      dispatch(drawActionCreator());

      return;
    }
  }, [turn, dispatch]);

  useEffect(() => {
    if(mode !== 'computer') return;

    if(winner !== null || !started || side === turn || game === null) return;

    const timeout = setTimeout(() => {
      const move = game.aiMove();
      for(const [start, end] of Object.entries(move as {[key: string]: string})) {
        movePiece(getPieceByPosition(positionToIndex(start), pieces)!.id, positionToIndex(end), pieces, true, true, false);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [side, turn, winner, started, mode, movePiece, pieces]);

  useEffect(() => {
    if(winner === null) return;

    if((winner as Colors | 'draw') === 'draw') {
      send(Events.DRAW);
    } else if(winner !== side) {
      send(Events.LOSS);
    }

  }, [winner, send, side]);

  useEffect(() => {
    game = new Game();

    return () => {
      game = null;
    };
  }, []);
  
  const data: LogicInterface = {
    canBeDropped: (pieceId: string, target: number) => canDrop(pieceId, target, pieces),
    movePiece: (pieceId: string, target: number) => movePiece(pieceId, target, pieces),
    getPieceByPosition,
    promote
  }

  return <>
    <Logic.Provider value={data}>{children}</Logic.Provider>
    {select}
  </>;
};

export default LogicContext;