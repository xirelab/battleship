import { createReducer, on } from "@ngrx/store/src/reducer_creator";
import { BoardActionTypes } from "./board.action";
import { BoardState } from "./board.state";
import * as action from './board.action';
import { Board } from "../models/board.model";
import { state } from "@angular/animations";
import * as utils from '../utils/common.util';

const initialState: BoardState = {
  numberOfCells: 10,
  numberOfShips: 2,
  xDimension:[],
  yDimension:[],
  myBoard: new Board(10),
  systemBoard: null  
};

const _counterReducer = createReducer(
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

  // on(action.initializeBoard, (state, { board }) => ({
  //   ...state,
  //   state.systemBoard: board,
  // })),
  // on(action.initializeBoard, (state, { board }) => ({
  //   ...state,
  //   state.systemBoard: board,
  // })),
  // on(action.initializeBoard, (state, { board }) => {
  //   state.number

  //   ...state,
  //   state.systemBoard: board,
  // })
);
