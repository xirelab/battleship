import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Board, IBoard } from '../models/board.model';
import { Cell } from '../models/cell.model';
import * as constant from '../models/constants.model';
import { Slot } from '../models/slot.model';
import * as utils from '../utils/common.util';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private board: BehaviorSubject<IBoard>;
  private prev: Cell;
  private prevprev: Cell;

  initializeOpponent(systemBoard: Board, numberOfShips: number): Observable<IBoard> {
    if (!systemBoard) {
      if (!this.board) {
        this.board = new BehaviorSubject<IBoard>(new Board(10))
      } else {
        this.board.next(new Board(10));
      }      
      return this.board.asObservable();
    }
    
    for (let i = numberOfShips + 1; i > 1 ; i--) {
      let randomX : number;
      let randomY : number;
      if (i%2 == 0) {
        randomX = utils.getRandomInt(1, 10);
        randomY = utils.getRandomInt(1, 10);
        console.log(`i = ${i} random x: ${randomX}, y: ${randomY}`);
        let isShipSet = false;
        let isXrightOk = true;
        let isXleftOk = true;
        while (!isShipSet) {
          isXrightOk = true;
          isXleftOk = true;
          if (randomX + i <= 10) {
            isXleftOk = false;
            for (let x = randomX; x < randomX + i; x++) {
              const cell = systemBoard.cells.find(a => a.x == `${x}` && a.y == `${constant.yDimension[randomY-1]}`);
              if (cell && cell.isShip === true) { isXrightOk = false; } 
            }
          } else {
            isXrightOk = false;
            for (let x = randomX; x > randomX - i; x--) {
              const cell = systemBoard.cells.find(a => a.x == `${x}` && a.y == `${constant.yDimension[randomY-1]}`);
              if (cell && cell.isShip === true) { isXleftOk = false; }
            }
          }
          if (isXrightOk) {
            isShipSet = true;
            for (let x = randomX; x < randomX + i; x++) {
              const cell = systemBoard.cells.find(a => a.x == `${x}` && a.y == `${constant.yDimension[randomY-1]}`);
              if (cell) { cell.isShip = true; }    
            }
          } else if (isXleftOk) {
            isShipSet = true;
            for (let x = randomX; x > randomX - i; x--) {
              const cell = systemBoard.cells.find(a => a.x == `${x}` && a.y == `${constant.yDimension[randomY-1]}`);
              if (cell) { cell.isShip = true; }    
            }
          } else {
            randomX = utils.getRandomInt(1, 10);
            randomY = utils.getRandomInt(1, 10);
            console.log(`i = ${i} random x: ${randomX}, y: ${randomY}`);
          }
        }
      } else {
        randomX = utils.getRandomInt(1, 10);
        randomY = utils.getRandomInt(1, 10);
        console.log(`i = ${i} random x: ${randomX}, y: ${randomY}`);
        let isShipSet = false;
        let isYrightOk = true;
        let isYleftOk = true;
        while (!isShipSet) {
          isYrightOk = true;
          isYleftOk = true;
          if (randomY + i <= 10) { 
            isYleftOk = false;
            for (let y = randomY; y < randomY + i; y++) {
              const cell = systemBoard.cells.find(a => a.x == `${randomX}` && a.y == `${constant.yDimension[y-1]}`);
              if (cell && cell.isShip === true) { isYrightOk = false; } 
            }
          } else {
            isYrightOk = false;
            for (let y = randomY; y > randomY - i; y--) {
              const cell = systemBoard.cells.find(a => a.x == `${randomX}` && a.y == `${constant.yDimension[y-1]}`);
              if (cell && cell.isShip === true) { isYleftOk = false; }
            }
          }
          if (isYrightOk) {
            isShipSet = true;
            for (let y = randomY; y < randomY + i; y++) {
              const cell = systemBoard.cells.find(a => a.x == `${randomX}` && a.y == `${constant.yDimension[y-1]}`);
              if (cell) { cell.isShip = true; }    
            }
          } else if (isYleftOk) {
            isShipSet = true;
            for (let y = randomY; y > randomY - i; y--) {
              const cell = systemBoard.cells.find(a => a.x == `${randomX}` && a.y == `${constant.yDimension[y-1]}`);
              if (cell) { cell.isShip = true; }    
            }
          } else {
            randomX = utils.getRandomInt(1, 10);
            randomY = utils.getRandomInt(1, 10);
            console.log(`i = ${i} random x: ${randomX}, y: ${randomY}`);
          }
        }
      }
    }

    // manual logic - todo - remove
    // if (numberOfShips >= 3) {
    //   for (let i = 2; i < 6; i++) {
    //     const cell = systemBoard.cells.find(a => a.x == `${i}` && a.y == 'C');
    //     if (cell) { cell.isShip = true; }
    //   }
    // }

    // for (let i = 5; i < 8; i++) {
    //   const cell = systemBoard.cells.find(a => a.x == '5' && a.y == constant.yDimension[i]);
    //   if (cell) { cell.isShip = true; }
    // }

    // for (let i = 7; i < 9; i++) {
    //   const cell = systemBoard.cells.find(a => a.x == `${i}` && a.y == 'E');
    //   if (cell) { cell.isShip = true; }
    // }

    if (!this.board) {
      this.board = new BehaviorSubject<IBoard>(systemBoard)
    } else {
      this.board.next(systemBoard);
    }

    return this.board.asObservable();
  }

  triggerSystemFire(board: Board): string {
    if (board && board.cells) {
      let xValue: any;
      let yValue: any;
      let icase: number = 1;
      do {
        if (this.prev) {
          xValue = icase == 1 || icase == 3 ? this.prev.x + 1 : this.prev.x;
          yValue = icase == 2 || icase == 4 ? this.prev.y + 1 : this.prev.y;
          icase ++;
        } else {
          xValue = utils.getRandomInt(1, 10).toString();
          yValue = constant.yDimension[utils.getRandomInt(1, 10)];
        }
        
        const cell = board.cells.find(i => i.x === xValue && i.y === yValue);
        if (cell && !cell.value) {
          // this.prevprev = this.prev;
          // this.prev = cell; 
          return `${xValue}${yValue}`;
        }
      }
      while (true);
    }
  }
}
