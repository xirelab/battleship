import { BoardActionTypes } from "./board.action";
import { BoardState } from "./board.state";
import * as action from './board.action';
import { Board } from "../models/board.model";
import { state } from "@angular/animations";
import * as utils from '../utils/common.util';
import { ActionCreator, createReducer, on } from '@ngrx/store';

const initialState: BoardState = {
  numberOfCells: 10,
  numberOfShips: 2,
  xDimension: utils.getXdimension(10),
  yDimension: utils.getYdimension(10),
  myBoard: new Board(10),
  systemBoard: new Board(10),
  currentPlayer: ''
};

export const boardReducer = createReducer(
  initialState,
  on(action.initializeBoard, (state) => {
    state.numberOfCells = 10,
    state.numberOfShips = 2,
    state.xDimension = utils.getXdimension(10),
    state.yDimension = utils.getYdimension(10),
    state.myBoard = new Board(10),
    state.systemBoard =  new Board(10)
    return {
      ...state
    }
  }),
  // on(action.initializeBoard, (state) => ({
  //  numberOfCells: 10,
  //   numberOfShips: 5,
  //   xDimension: utils.getXdimension(10),
  //   yDimension: utils.getYdimension(10),
  //   myBoard: new Board(10),
  //   systemBoard:  new Board(10),
  //   ...state
  // })),
  on(action.prepareSystemBoardCompleted, (state, { data }) => ({
    systemBoard: data,
    ...state
  })),
  // on(action.dropMissile, (state, { data }) => ({
  //   currentPlayer: utils.updateBoard(
  //     utils.updateCordinate(data),
  //     state.currentPlayer == '' || state.currentPlayer == 'Me' ? state.systemBoard : state.myBoard, 
  //     state.currentPlayer),
  //   ...state
  // })),
  on(action.dropMissile, (state, { data }) => {
    state.currentPlayer = utils.updateBoard(
      utils.updateCordinate(data),
      state.currentPlayer == '' || state.currentPlayer == 'Me' ? state.systemBoard : state.myBoard, 
      state.currentPlayer);
    return {
      ...state
    }
  })
);

// export function boardReducer(state: any, action: any) {
//   return _boardReducer(state, action);
// }