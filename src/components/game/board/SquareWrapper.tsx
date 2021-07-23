import React from 'react';
import { useSelector } from 'react-redux';
import { FullState, GameState, PieceGameData } from '../../../redux/state';
import Colors from './constants/Colors';
import PieceTypes from './constants/PieceTypes';
import { ItemInterface } from './Piece';
import Square from './Square';

export interface Props {
  position: number,
  color: Colors,
  canBeDropped: (pieceId: string, target: number) => boolean,
  movePiece: (pieceId: string, target: number) => void,
  promote: (pieceId: string, type: PieceTypes) => void
}

const SquareWrapper: React.FC<Props> = ({ position, color, children, movePiece, canBeDropped, promote }) => {
  const { turn, lastMove } = useSelector<FullState, GameState>(state => state.game);

  return (
    <Square
      promote={promote}
      movePiece={(piece: PieceGameData) => movePiece(piece.id, position)}
      canBeDropped={(piece: PieceGameData) => turn === piece.color && canBeDropped(piece.id, position)}
      lastMove={{previous: lastMove?.previous === position, current: lastMove?.current === position}}
      position={position}
      color={color}
    >
      {children}
    </Square>
  );
};

export default SquareWrapper;