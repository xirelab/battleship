import { createAction, props } from '@ngrx/store';
import { Board } from '../models/board.model';


export enum BoardActionTypes {
  InitializeBoard = "[Board] initialize Board",
  PrepareSystemBoard = "[Board] Prepare System Board",
  PrepareSystemBoardCompleted = "[Board] Prepare System Board Completed",
}

// export const initializeBoard = createAction(
//   BoardActionTypes.InitializeBoard,
//   props<{ board: Board }>()
// );

export const initializeBoard = createAction(BoardActionTypes.InitializeBoard);
export const prepareSystemBoard = createAction(BoardActionTypes.PrepareSystemBoard);
export const prepareSystemBoardCompleted = createAction(
  BoardActionTypes.PrepareSystemBoardCompleted,
  props<{ data: Board }>()
);


// export const increment = createAction('[Counter Component] Increment');
// export const decrement = createAction('[Counter Component] Decrement');
// export const reset = createAction('[Counter Component] Reset');
