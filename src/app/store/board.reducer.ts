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

// Initial setup. 10 cells and 2 ships..
const numberofCells = 10;
const numberofShips = 2;

export const boardReducer = createReducer(
  initialState,
  on(action.initializeBoard, (state) => {
    state.numberOfCells = numberofCells,
    state.numberOfShips = numberofShips,
    state.xDimension = utils.getXdimension(numberofCells),
    state.yDimension = utils.getYdimension(numberofCells),
    state.myBoard = new Board(numberofCells),
    state.systemBoard =  new Board(numberofCells)
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
      state.currentPlayer == 'System' ? state.myBoard : state.systemBoard,
      state.currentPlayer);
    return {
      ...state
    }
  })
);
