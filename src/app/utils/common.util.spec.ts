import { mockBoard } from '../models/constants.model';
import * as utils from '../utils/common.util';

describe('Utils', () => {
  describe('getXdimension', () => {
    it('should return Xdimension return proper response', () => {
      // Act
      const response = utils.getXdimension(2);

      // Assert
      expect(response).toBe(['1', '2']);
    });  

    it('should return Xdimension return empty', () => {
      // Act
      const response = utils.getXdimension(0);

      // Assert
      expect(response).toBe([]);
    });  
  })

  describe('getYdimension', () => {
    it('should return Ydimension return proper response', () => {
      // Act
      const response = utils.getYdimension(2);

      // Assert
      expect(response).toBe(['A', 'B']);
    });  

    it('should return Ydimension return empty', () => {
      // Act
      const response = utils.getYdimension(0);

      // Assert
      expect(response).toBe([]);
    });  
  })

  describe('updateCordinate', () => {
    it('should return dimension - 2 digits', () => {
      // Arrange
      const slot = {x: '2', y: 'B'};

      // Act
      const response = utils.updateCordinate('2B');

      // Assert
      expect(response).toBe(slot);
    });  

    it('should return dimension - 3 digits', () => {
      // Arrange
      const slot = {x: '10', y: 'F'};

      // Act
      const response = utils.updateCordinate('10F');

      // Assert
      expect(response).toBe(slot);
    }); 
  })

  describe('updateBoard', () => {
    it('should return type as Me', () => {
      // Arrange
      const slot = {x: '1', y: 'B'};
      const board = mockBoard;

      // Act
      const response = utils.updateBoard(slot, board, 'System');

      // Assert
      expect(response).toBe('Me');
    }); 

    it('should return type as System', () => {
      // Arrange
      const slot = {x: '2', y: 'C'};
      const board = mockBoard;

      // Act
      const response = utils.updateBoard(slot, board, 'Me');

      // Assert
      expect(response).toBe('System');
    }); 

    it('should return type as Me-Invalid', () => {
      // Arrange
      const slot = {x: '10', y: 'F'};
      const board = mockBoard;

      // Act
      const response = utils.updateBoard(slot, board, 'Me');

      // Assert
      expect(response).toBe('Me-Invalid');
    }); 

    it('should return type as Me-Exists', () => {
      // Arrange
      const slot = {x: '1', y: 'A'};
      const board = mockBoard;
      // board[0].value = 'hit';

      // Act
      const response = utils.updateBoard(slot, board, 'Me');

      // Assert
      expect(response).toBe('Me-Exists');
    }); 
  })

  describe('checkBoard', () => {
    it('should return true', () => {
      // Arrange
      const board = mockBoard;
      // board[0].isShip = true;
      // board[0].value = 'hit';

      // Act
      const response = utils.checkBoard(board);

      // Assert
      expect(response).toBeTruthy();
    });  

    it('should return false', () => {
      // Arrange
      const board = mockBoard;
      // board[0].isShip = true;
      // board[0].value = '';

      // Act
      const response = utils.checkBoard(board);

      // Assert
      expect(response).toBeFalsy();
    }); 
  })
})