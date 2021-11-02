import { boardReducer } from "./board.reducer";
import * as actions from './board.action';
import { Board } from "../models/board.model";

describe('Utils', () => {
  let currentState;
  beforeEach(() => {
    currentState = {
      numberOfCells: 0,
      numberOfShips: 0,
      xDimension: [],
      yDimension: [],
      myBoard: null,
      opponentBoard: null,
      currentPlayer: ''
    }
  })

  describe('initializeBoard', () => {
    it('should initializeBoard', () => {
      // Act
      const state = boardReducer(currentState, actions.initializeBoard);
      const myBoard = new Board(10);
      const opponentBoard = new Board(10);

      // Assert
      expect(state.numberOfCells).toBe(10);
      expect(state.numberOfShips).toBe(2);
      expect(state.xDimension).toBe(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
      expect(state.yDimension).toBe(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);
      // expect(state.myBoard).toBe(myBoard);
      // expect(state.opponentBoard).toBe(opponentBoard);
    });
  })

  describe('dropMissile', () => {
    it('should dropMissile', () => {
      // Act
      const state = boardReducer(currentState, actions.dropMissile({
        data: '1B'
      }));

      // Assert
      expect(state.currentPlayer).toBe('System');;
    });
  })
});
