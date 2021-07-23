import React from 'react';
import { DragObjectWithType, useDrag } from 'react-dnd';
import { PieceGameData } from '../../../redux/state';
import { SpecialMoveProp } from './constants/ItemProp';
import { DragPieceType } from './constants/PieceTypes';

export interface ItemInterface extends DragObjectWithType {
  type: typeof DragPieceType,
  piece: PieceGameData
}
export interface Props {
  piece: PieceGameData,
}

const Piece: React.FC<Props> = ({ piece }) => {
  const item: ItemInterface = { 
    piece,
    type: DragPieceType
  };

  const [{ isDragging }, dragRef] = useDrag(() => ({
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return <div ref={dragRef} className={`piece ${piece.type} ${piece.color} ${isDragging ? 'hide' : ''}`} />;
};

export default Piece;