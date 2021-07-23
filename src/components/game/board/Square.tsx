import React, { memo, useState } from 'react';
import Colors from './constants/Colors';
import PieceTypes, { DragPieceType } from './constants/PieceTypes';
import { useDrop } from 'react-dnd';
import { ItemInterface } from './Piece';
import { PieceGameData } from '../../../redux/state';
import { Menu, MenuItem } from '@material-ui/core';

export interface Props {
  color: Colors,
  position: number,
  movePiece: (piece: PieceGameData, target: number) => void,
  canBeDropped: (piece: PieceGameData,) => boolean,
  lastMove: { current: boolean, previous: boolean },
  promote: (pieceId: string, type: PieceTypes) => void
}

const Square: React.FC<Props> = memo(({ color, position, movePiece, canBeDropped, promote, lastMove, children }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [item, setItem] = useState<ItemInterface | null>(null);

  const openSelection = (elem: HTMLDivElement, item: ItemInterface) => {
    setAnchorEl(elem);
    setItem(item);
  };

  const handleSelection = (type: PieceTypes) => {
    promote(item!.piece.id, type);
    movePiece(item!.piece, position);
    setAnchorEl(null);
    setItem(null);
  };

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: DragPieceType,
    drop: (item: ItemInterface) => {
      if(item.piece.type !== PieceTypes.pawn || (Math.floor(position / 8) !== 0 && Math.floor(position / 8) !== 7)) {
        movePiece(item.piece, position);
        return;
      }

      if((item.piece.color === Colors.white && Math.floor(position / 8) === 0) ||
          (item.piece.color === Colors.black && Math.floor(position / 8) === 7)) {
        openSelection(document.querySelector(`#square${position}`)!, item);
      }
    },
    canDrop: (item: ItemInterface) => canBeDropped(item.piece),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  })
  return <div id={`square${position}`} className={`square fill ${color}`} ref={dropRef} >
    {/* <div className='float'>{ position }</div> */}
    {canDrop && <div className="can-drop fill float"/>}
    <div className={`fill ${isOver ? 'is-over' : ''} ${lastMove.previous ? 'previous' : ''} ${lastMove.current ? 'current' : ''}`}>
      {children}
    </div>
    {item && <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem onClick={() => handleSelection(PieceTypes.queen)}>
        <div 
          className={`piece queen ${item!.piece.color}`} 
          style={{width: '4em', height: '4em'}}
        />
      </MenuItem>
      <MenuItem onClick={() => handleSelection(PieceTypes.rook)}>
        <div 
          className={`piece rook ${item!.piece.color}`} 
          style={{width: '4em', height: '4em'}}
        />
      </MenuItem><MenuItem onClick={() => handleSelection(PieceTypes.bishop)}>
        <div 
          className={`piece bishop ${item!.piece.color}`} 
          style={{width: '4em', height: '4em'}}
        />
      </MenuItem><MenuItem onClick={() => handleSelection(PieceTypes.knight)}>
        <div 
          className={`piece knight ${item!.piece.color}`} 
          style={{width: '4em', height: '4em'}}
        />
      </MenuItem>
    </Menu>}
  </div>;
});

export default Square;