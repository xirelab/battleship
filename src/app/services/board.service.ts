import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Board, IBoard } from '../models/board.model';
import * as constant from '../models/constants.model';
import { Slot } from '../models/slot.model';
import * as utils from '../utils/common.util';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private board: BehaviorSubject<IBoard>;

  // getXdimension(numberofCells: number) {
  //   const dimensions = [];
  //   for (let i = 1; i <= numberofCells; i++) {
  //     dimensions.push(`${i}`);
  //   }
  //   return dimensions;
  // }

  // getYdimension(numberofCells: number) {
  //   const dimensions = [];
  //   for (let i = 0; i < numberofCells; i++) {
  //     dimensions.push(`${constant.yDimension[i]}`);
  //   }
  //   return dimensions;
  // }

  initializeOpponent(systemBoard: Board, numberOfShips: number): Observable<IBoard> {
    for (let i = 0; i < numberOfShips; i++) {
      const randomNumber = utils.getRandomInt(1, 10);
      console.log('randomNumber = ' + randomNumber);
      // TODO: wrte logic to dynamically set board
    }

    if (!systemBoard) {
      if (!this.board) {
        this.board = new BehaviorSubject<IBoard>(new Board(10))
      } else {
        this.board.next(new Board(10));
      }      
      return this.board.asObservable();
    } 

    // manual logic - todo - remove
    // for (let i = 2; i < 6; i++) {
    //   const cell = systemBoard.cells.find(a => a.x == `${i}` && a.y == 'C');
    //   cell.isShip = true;
    // }

    for (let i = 5; i < 8; i++) {
      const cell = systemBoard.cells.find(a => a.x == '5' && a.y == constant.yDimension[i]);
      cell.isShip = true;
    }

    for (let i = 7; i < 9; i++) {
      const cell = systemBoard.cells.find(a => a.x == `${i}` && a.y == 'E');
      cell.isShip = true;
    }

    if (!this.board) {
      this.board = new BehaviorSubject<IBoard>(systemBoard)
    } else {
      this.board.next(systemBoard);
    }

    return this.board.asObservable();
  }

  triggerSystemFire(board: Board): string {
    if (board && board.cells) {
      const xValue = utils.getRandomInt(1, 10).toString();
      const yValue = constant.yDimension[utils.getRandomInt(1, 10)];
      const cell = board.cells.find(i => i.x === xValue && i.y === yValue);
      if (cell && !cell.value) {
        return `${xValue}${yValue}`;
      }
    }
    return null;
  }

  checkResult(board: Board): boolean {
    if (board && board.cells) {
      const cells = board.cells.find(i => i.isShip && i.value === '');
      if (cells) {
        return false;
      }
    }
    return true;
  }
}
