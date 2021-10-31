import { Board } from "../models/board.model";

export interface BoardState {
  me: string;
  opponent: string;
  numberOfCells: number;
  numberOfShips: number;
  xDimension: string[];
  yDimension: string[];
  myBoard: Board;
  opponentBoard: Board;
  currentPlayer: string;
  isSetupCompleted: boolean;
  isSinglePlayer: boolean;
}

export class AppState {
  board: BoardState;
}