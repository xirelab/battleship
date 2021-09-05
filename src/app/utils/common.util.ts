import { Board } from '../models/board.model';
import * as constant from '../models/constants.model';
import { Slot } from '../models/slot.model';

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getXdimension(numberofCells: number) {
  const dimensions = [];
  for (let i = 1; i <= numberofCells; i++) {
    dimensions.push(`${i}`);
  }
  return dimensions;
}

export function getYdimension(numberofCells: number) {
  const dimensions = [];
  for (let i = 0; i < numberofCells; i++) {
    dimensions.push(`${constant.yDimension[i]}`);
  }
  return dimensions;
}

export function updateCordinate(data: string): Slot {
  if (data) {
    let xValue = data.substr(0,1);
    let yValue = '';
    if (xValue === "1") {
      xValue = data.substr(0,2);
      yValue = data.substr(2,1);
    } else {
      yValue = data.substr(1,1);
    }   

    return {x: xValue, y: yValue};
  }
}

export function updateBoard(cell: Slot, board: Board, type: string): string {
  if (cell && board && board.cells) {
    const cells = board.cells.find(c => c.x == cell.x && c.y === cell.y);    

    if (!cells) {
      return type === '' || type === 'Me' ? 'Me-Invalid' : 'System-Invalid';
    } else if (cells && cells.value) {
      return type === '' || type === 'Me' ? 'Me-Exists' : 'System-Exists';
    }

    if (cells) {
      cells.value = cells.isShip ? 'hit' : 'miss';
      return type === '' || type === 'Me' ? 'System' : 'Me';
    }
  }  
}