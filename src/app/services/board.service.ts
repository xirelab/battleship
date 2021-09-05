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
      
    }
  }

  getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
