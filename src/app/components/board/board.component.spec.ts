import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BoardComponent } from './board.component';
import { TitleCasePipe } from '@angular/common';
import { mockBoard } from '../../models/constants.model';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeAll((done) => (async () => {
    TestBed.configureTestingModule({
      declarations: [ BoardComponent ],
      imports: [ ],
      providers: [ TitleCasePipe ]
    });
    await TestBed.compileComponents();
  })().then(done).catch(done.fail));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('shipDetails', () => {
    it('should return shipDetails empty', () => {
      // Arrange
      component.type = 'opponent';
      component.currentShip = 0;

      // Act
      const response = component.shipDetails;

      // Assert
      expect(response).toBe('');
    });  

    it('should return shipDetails proper', () => {
      // Arrange
      component.type = 'self';
      component.numberofShips = 5;
      component.currentShip = 2;

      // Act
      const response = component.shipDetails;

      // Assert
      expect(response).toBe('Select fourth ship (3 cells)..');
    });  
  });

  describe('isShip', () => {
    it('should return true', () => {
      // Arrange
      component.type = 'opponent';
      component.currentShip = 0;
      component.showShips = true;
      component.board = mockBoard;
      component.board[1].isShip = true;

      // Act
      const response = component.isShip("1", "B");

      // Assert
      expect(response).toBeTruthy();
    });  

    it('should return false', () => {
      // Arrange
      component.type = 'opponent';
      component.currentShip = 0;
      component.showShips = true;
      component.board = mockBoard;
      component.board[1].isShip = true;

      // Act
      const response = component.isShip("1", "Z");

      // Assert
      expect(response).toBeFalsy();
    });  
  });

  describe('isHit', () => {
    it('should return true', () => {
      // Arrange
      component.type = 'opponent';
      component.currentShip = 0;
      component.showShips = true;
      component.board = mockBoard;
      component.board[1].value = 'hit';

      // Act
      const response = component.isHit("1", "B");

      // Assert
      expect(response).toBeTruthy();
    });  

    it('should return false', () => {
      // Arrange
      component.type = 'opponent';
      component.currentShip = 0;
      component.showShips = true;
      component.board = mockBoard;
      component.board[1].value = '';

      // Act
      const response = component.isHit("1", "Z");

      // Assert
      expect(response).toBeFalsy();
    });  
  });

  describe('value', () => {
    it('should return X', () => {
      // Arrange
      component.type = 'opponent';
      component.currentShip = 0;
      component.showShips = true;
      component.board = mockBoard;
      component.board[1].value = 'hit';

      // Act
      const response = component.value("1", "B");

      // Assert
      expect(response).toBe('X');
    });  

    it('should return O', () => {
      // Arrange
      component.type = 'opponent';
      component.currentShip = 0;
      component.showShips = true;
      component.board = mockBoard;
      component.board[1].value = 'miss';

      // Act
      const response = component.value("1", "B");

      // Assert
      expect(response).toBe('O');
    });  
  });

  describe('isEnabled', () => {
    it('should return false', () => {
      // Arrange
      component.type = 'opponent';
      component.currentShip = 0;
      component.showShips = true;
      component.board = mockBoard;
      component.board[1].value = 'hit';

      // Act
      const response = component.isEnabled("1", "B");

      // Assert
      expect(response).toBeFalsy();
    });

    it('should return true', () => {
      // Arrange
      component.type = 'me';
      component.numberOfcellSelected = 0;
      component.showShips = true;
      component.board = mockBoard;
      component.board[1].value = 'hit';

      // Act
      const response = component.isEnabled("1", "B");

      // Assert
      expect(response).toBeTruthy();
    });
  });

  describe('isNextPossibleCell', () => {
    it('should return false', () => {
      // Arrange
      component.type = 'opponent';
      component.currentShip = 0;
      component.showShips = true;
      component.board = mockBoard;
      component.board[1].isShip = true;

      // Act
      const response = component.isNextPossibleCell("1", "B");

      // Assert
      expect(response).toBeFalsy();
    });

    it('should return true', () => {
      // Arrange
      component.type = 'me';
      component.numberOfcellSelected = 0;
      component.showShips = true;
      component.board = mockBoard;
      component.board[1].value = 'hit';
      component.lastSelectedCell = {x: "1", y: "A"};

      // Act
      const response = component.isNextPossibleCell("1", "B");

      // Assert
      expect(response).toBeTruthy();
    });
  });

  describe('click', () => {
    it('should increment numberOfcellSelected', () => {
      // Arrange
      component.type = 'opponent';
      component.currentShip = 3;
      component.numberOfcellSelected = 1;
      component.showShips = true;
      component.board = mockBoard;
      component.board[1].value = 'hit';
      const slot = {x: '1', y: 'B'};

      // Act
      component.click("1", "B");

      // Assert
      expect(component.lastSelectedCell).toBe(slot);
      expect(component.currentShip).toBe(3);
      expect(component.numberOfcellSelected).toBe(2);
    });

    it('should reset numberOfcellSelected', () => {
      // Arrange
      component.type = 'opponent';
      component.currentShip = 3;
      component.numberOfcellSelected = 3;
      component.showShips = true;
      component.board = mockBoard;
      component.board[1].value = 'hit';
      const slot = {x: '1', y: 'B'};

      // Act
      component.click("1", "B");

      // Assert
      expect(component.lastSelectedCell).toBe(slot);
      expect(component.currentShip).toBe(2);
      expect(component.numberOfcellSelected).toBe(0);
    });

    it('should emit all ships selected', () => {
      // Arrange
      component.type = 'opponent';
      component.currentShip = 1;
      component.numberOfcellSelected = 1;
      component.showShips = true;
      component.board = mockBoard;
      component.board[1].value = 'hit';
      const slot = {x: '1', y: 'B'};
      spyOn(component.shipSelected, 'emit');

      // Act
      component.click("1", "B");

      // Assert
      expect(component.lastSelectedCell).toBe(slot);
      expect(component.currentShip).toBe(0);
      expect(component.numberOfcellSelected).toBe(0);
      expect(component.shipSelected.emit).toHaveBeenCalledWith(true);
    });
  });
});