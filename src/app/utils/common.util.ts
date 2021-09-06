import { Board } from '../models/board.model';
import * as constant from '../models/constants.model';
import { Slot } from '../models/slot.model';

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getXdimension(numberofCells: number): string[] {
  const dimensions = [];
  for (let i = 1; i <= numberofCells; i++) {
    dimensions.push(`${i}`);
  }
  return dimensions;
}

export function getYdimension(numberofCells: number): string[] {
  const dimensions = [];
  for (let i = 0; i < numberofCells; i++) {
    dimensions.push(`${constant.yDimension[i]}`);
  }
  return dimensions;
}

export function updateCordinate(data: string): Slot {
  if (data) {
    if (data.substr(0, 1) === "1" && data.length === 3) {
      return {x: data.substr(0, 2), y: data.substr(2, 1)};
    }
    return {x: data.substr(0, 1), y: data.substr(1, 1)};
  }
}

export function updateBoard(cell: Slot, board: Board, type: string): string {
  if (cell && board && board.cells) {
    let cells = board.cells.find(c => c.x == cell.x && c.y === cell.y);    

    // only manual entry can be wrong..
    if (!cells) { return 'Me-Invalid';} 
    else if (cells && cells.value) { return 'Me-Exists'; }

    if (cells) {
      cells.value = cells.isShip ? 'hit' : 'miss';
      return type === 'System' ? 'Me' : 'System';
    }
  }
}

export function gameStatus(myBoard: Board, systemBoard: Board): string {
  if (checkBoard(systemBoard)) return 'You';
  if (checkBoard(myBoard)) return 'System';
  return '';
}

export function checkBoard(board: Board): boolean {
  if (board && board.cells && board.cells.find(i => i.isShip)) {
    const cells = board.cells.find(i => i.isShip && i.value === '');
    if (!cells) {
      return true;
    }
  }
  return false;
}