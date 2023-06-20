import { Board } from "../models/board.model";
import { Player } from "../models/player.model";

export interface BoardState {
  numberOfCells: number | undefined;
  numberOfShips: number | undefined;
  xDimension: string[] | undefined;
  yDimension: string[] | undefined;
  currentPlayer: string | null;
  isSetupCompleted: boolean;
  isSinglePlayer: boolean;
  me: Player | null;
  opponent: Player | null;
  level: number;
}

export class AppState {
  board: BoardState | undefined;
}