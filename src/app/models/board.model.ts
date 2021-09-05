import { Cell } from './cell.model';
import * as constant from '../models/constants.model';

export class Board {
  cells: Array<Cell>;

  constructor(numberofCells: number) {
    this.cells = [];
    for (let i = 1; i <= numberofCells; i++) {
      for (let j = 0; j < numberofCells; j++) {
        this.cells.push({
          x: `${i}`,
          y: `${constant.yDimension[j]}`,
          isShip: false,
          value: ''
        })
      }
    }
  }
}
