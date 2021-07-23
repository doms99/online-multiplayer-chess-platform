import React, { ReactElement, useContext } from 'react';
import Colors from './constants/Colors';
import './Board.css';
import SquareWrapper from './SquareWrapper';
import Piece, { ItemInterface } from './Piece';
import { GamePieceState, PieceGameData } from '../../../redux/state';
import { Logic } from '../../contexts/LogicContext';
import PieceTypes from './constants/PieceTypes';

export interface Props {
  side: Colors,
  canBeDropped: (pieceId: string, target: number) => boolean,
  movePiece: (pieceId: string, target: number) => void,
  getPieceByPosition: (position: number) => PieceGameData | null,
  promote: (pieceId: string, type: PieceTypes) => void
}

const Board: React.FC<Props> = ({ side, canBeDropped, movePiece, getPieceByPosition, promote }) => {  

  let squares: ReactElement[] = [];
  let squareColor = Colors.white;
  for(let i = 0, pos = 1; i < 64; i++) {
    const position = side === Colors.white ? i : 63 - i;
    const piece = getPieceByPosition(position);
    squares[i] = (
      <SquareWrapper
        promote={promote}
        color={squareColor}
        position={position}
        key={position}
        canBeDropped={canBeDropped}
        movePiece={movePiece}
      >
        {!!piece && <Piece piece={piece} />}
      </SquareWrapper>
    )
    if(pos !== 8) {
      squareColor = squareColor === Colors.white ? Colors.black : Colors.white;
      pos++;
    } else {
      pos = 1;
    }
  }

  return (
      <div className="board fill">
        {squares}
      </div>
  );
}

export default Board;