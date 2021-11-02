import { BoardState } from "./board.state";
import * as action from './board.action';
import { Board } from "../models/board.model";
import * as utils from '../utils/common.util';
import { createReducer, on } from '@ngrx/store';
import { Player } from "../models/player.model";

const initialState: BoardState = {
  me: null,
  opponent: null,
  numberOfCells: 0,
  numberOfShips: 0,
  xDimension: [],
  yDimension: [],
  currentPlayer: '',
  isSinglePlayer: true,
  isSetupCompleted: true
};

// Initial setup. 10 cells and 3 ships..
const numberofCells = 10;
const numberofShips = 2;
const numberofLifes = 3;

export const boardReducer = createReducer(
  initialState,
  on(action.initializeBoard, (state) => {
    state.numberOfCells = numberofCells,
    state.numberOfShips = numberofShips,
    state.xDimension = utils.getXdimension(numberofCells),
    state.yDimension = utils.getYdimension(numberofCells),
    state.me = new Player(numberofCells, numberofLifes),
    state.opponent =  new Player(numberofCells, numberofLifes)
    return {
      ...state
    }
  }),
  on(action.SetPlayerType, (state, { isSingleUser }) => {
    state.isSinglePlayer = isSingleUser;
    if (isSingleUser) {
      state.opponent.name = 'System';
    }
    return {
      ...state
    }
  }),
  on(action.SetMyName, (state, { name }) => {
    state.me.name = name;
    return {
      ...state
    }
  }),
  on(action.SetOpponentName, (state, { name }) => {
    state.opponent.name = name;
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
    state.opponent.board = data;
    return {
      ...state
    }
  }),
  on(action.dropMissile, (state, { data }) => {
    state.currentPlayer = utils.updateBoard(
      utils.updateCordinate(data),
      state.currentPlayer == 'Opponent' ? state.me.board : state.opponent.board,
      state.currentPlayer);
    return {
      ...state
    }
  }),
  on(action.ReduceOneLife, (state) => {
    state.me.lifes -= 1;
    return {
      ...state
    }
  }),
  on(action.SetNumberofShips, (state, { count }) => {
    state.numberOfShips = count;
    return {
      ...state
    }
  })
);
