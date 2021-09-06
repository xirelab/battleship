import { inject, TestBed } from "@angular/core/testing";
import { mockBoard } from "../models/constants.model";
import { BoardService } from "./board.service";

describe('BoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ ],
    providers: [ ]
  }));

  it('should create', () => {
    const service: BoardService = TestBed.get(BoardService);
    expect(service).toBeTruthy();
  });

  describe('initializeOpponent', () => {
    it('should return ', inject([BoardService], (service: BoardService) => {
      // Arrange
      const board = mockBoard;
      let result: any;
      const responseBoard = board;
      responseBoard[5].isShip = true;
      responseBoard[8].isShip = true;

      // Act
      service.initializeOpponent(board, 3).subscribe(res => {
        result = res;
      });

      // Assert
      expect(result).not.toBeNull();
      expect(result).toBe(responseBoard);
    }));
  })
})