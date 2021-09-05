import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';
import * as constant from '../models/constants.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  getXdimension(numberofCells: number) {
    const dimensions = [];
    for (let i = 1; i <= numberofCells; i++) {
      dimensions.push(`${i}`);
    }
    return dimensions;
  }

  getYdimension(numberofCells: number) {
    const dimensions = [];
    for (let i = 0; i < numberofCells; i++) {
      dimensions.push(`${constant.yDimension[i]}`);
    }
    return dimensions;
  }

  initializeOpponent(board: Board, numberOfShips: number) {
    for (let i = 0; i < numberOfShips; i++) {
      const randomNumber = this.getRandomInt(1, 10);
      console.log('randomNumber = ' + randomNumber);
      // TODO: wrte logic to dynamically set board      
    }

    // manual logic - todo - remove
    for (let i = 2; i < 6; i++) {
      const cell = board.cells.find(a => a.x == `${i}` && a.y == 'C');
      cell.isShip = true;
    }

    for (let i = 5; i < 8; i++) {
      const cell = board.cells.find(a => a.x == '5' && a.y == constant.yDimension[i]);
      cell.isShip = true;
    }

    for (let i = 7; i < 9; i++) {
      const cell = board.cells.find(a => a.x == `${i}` && a.y == 'E');
      cell.isShip = true;
    }
  }

  getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
