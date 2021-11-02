import { Board } from "../models/board.model";
import { Player } from "../models/player.model";

export interface BoardState {
  // me: string;
  // opponent: string;
  numberOfCells: number;
  numberOfShips: number;
  xDimension: string[];
  yDimension: string[];
  // myBoard: Board;
  // opponentBoard: Board;
  currentPlayer: string;
  isSetupCompleted: boolean;
  isSinglePlayer: boolean;
  me: Player;
  opponent: Player;
}

export class AppState {
  board: BoardState;
}