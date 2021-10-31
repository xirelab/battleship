import { BoardState } from "./board.state";
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as utils from '../utils/common.util';

const selector = createFeatureSelector<BoardState>('board');

export const me = createSelector(
  selector,
  state => state && state.me
);

export const opponent = createSelector(
  selector,
  state => state && state.opponent
);

export const numberOfCells = createSelector(
  selector,
  state => state && state.numberOfCells
);

export const numberOfShips = createSelector(
  selector,
  state => state && state.numberOfShips
);

export const xDimension = createSelector(
  selector,
  state => state && state.xDimension
);

export const yDimension = createSelector(
  selector,
  state => state && state.yDimension
);

export const myBoard = createSelector(
  selector,
  state => state && state.myBoard
);

export const opponentBoard = createSelector(
  selector,
  state => state && state.opponentBoard
);

export const currentPlayer = createSelector(
  selector,
  state => state && state.currentPlayer
);

export const isSetupCompleted = createSelector(
  selector,
  state => state && state.isSetupCompleted
);

export const gameStatus = createSelector(
  selector,
  state => state && utils.gameStatus(state.myBoard, state.opponentBoard)
);
