import { BoardState } from "./board.state";
import { ActionCreator, createFeatureSelector, createSelector } from '@ngrx/store';

const selector = createFeatureSelector<BoardState>('board');

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

export const systemBoard = createSelector(
  selector,
  state => state && state.systemBoard
);

export const currentPlayer = createSelector(
  selector,
  state => state && state.currentPlayer
);
