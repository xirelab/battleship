import { BoardState } from "./board.state";
import * as action from './board.action';
import { Board } from "../models/board.model";
import * as utils from '../utils/common.util';
import { createReducer, on } from '@ngrx/store';

const initialState: BoardState = {
  numberOfCells: 0,
  numberOfShips: 0,
  xDimension: [],
  yDimension: [],
  myBoard: null,
  systemBoard: null,
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
  on(action.prepareSystemBoardCompleted, (state, { data }) => ({
    systemBoard: data,
    ...state
  })),
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