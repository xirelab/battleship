import { createAction, props } from '@ngrx/store';
import { Board } from '../models/board.model';


export enum BoardActionTypes {
  InitializeBoard = "[Board] initialize Board",
  PrepareSystemBoard = "[Board] Prepare System Board"
}

// export const initializeBoard = createAction(
//   BoardActionTypes.InitializeBoard,
//   props<{ board: Board }>()
// );

export const initializeBoard = createAction(BoardActionTypes.InitializeBoard);
export const initializeBoard = createAction(BoardActionTypes.PrepareSystemBoard);


// export const increment = createAction('[Counter Component] Increment');
// export const decrement = createAction('[Counter Component] Decrement');
// export const reset = createAction('[Counter Component] Reset');
