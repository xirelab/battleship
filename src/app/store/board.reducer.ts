import { BoardState } from "./board.state";
import * as action from './board.action';
import { Board } from "../models/board.model";
import * as utils from '../utils/common.util';
import { createReducer, on } from '@ngrx/store';

const initialState: BoardState = {
  me: '',
  opponent: '',
  numberOfCells: 0,
  numberOfShips: 0,
  xDimension: [],
  yDimension: [],
  myBoard: null,
  opponentBoard: null,
  currentPlayer: '',
  isSetupCompleted: true,
  isSinglePlayer: true
};

// Initial setup. 10 cells and 3 ships..
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
    state.opponentBoard =  new Board(numberofCells)
    return {
      ...state
    }
  }),
  on(action.SetPlayerType, (state, { isSingleUser }) => {
    state.isSinglePlayer = isSingleUser;
    if (isSingleUser) {
      state.opponent = 'System';
    }
    return {
      ...state
    }
  }),
  on(action.SetMyName, (state, { name }) => {
    state.me = name;
    return {
      ...state
    }
  }),
  on(action.SetOpponentName, (state, { name }) => {
    state.opponent = name;
    return {
      ...state
    }
  }),
  on(action.prepareSystemBoard, (state) => {
    state.isSetupCompleted = false
    return {
      ...state
    }
  }),
  on(action.prepareSystemBoardCompleted, (state, { data }) => {
    state.isSetupCompleted = false;
    state.opponentBoard = data;
    return {
      ...state
    }
  }),
  on(action.dropMissile, (state, { data }) => {
    state.currentPlayer = utils.updateBoard(
      utils.updateCordinate(data),
      state.currentPlayer == 'Opponent' ? state.myBoard : state.opponentBoard,
      state.currentPlayer);
    return {
      ...state
    }
  })
);
