import { Board } from "../models/board.model";
import { Player } from "../models/player.model";

export interface BoardState {
  numberOfCells: number;
  numberOfShips: number;
  xDimension: string[];
  yDimension: string[];
  currentPlayer: string;
  isSetupCompleted: boolean;
  isSinglePlayer: boolean;
  me: Player;
  opponent: Player;
}

export class AppState {
  board: BoardState;
}