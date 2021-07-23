export enum SpecialMoveType {
  castling = "castling",
  en_passant = "en passant"
}

export interface SpecialMoveProp {
  type: SpecialMoveType, 
  pieceId: string, 
  moveTarget: number
}

export interface CastelingExtra extends SpecialMoveProp {
  rookPosition: number
}