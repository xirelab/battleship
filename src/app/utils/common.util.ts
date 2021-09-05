import * as constant from '../models/constants.model';

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