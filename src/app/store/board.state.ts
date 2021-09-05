import { Board } from "../models/board.model";

export interface BoardState {
  numberOfCells: number,
  numberOfShips: number,
  xDimension: string[],
  yDimension: string[],
  myBoard: Board,
  systemBoard: Board  
}

export class AppState {
  board: BoardState;
}