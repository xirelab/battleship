import { Component, OnInit } from '@angular/core';
import { Board } from '../models/board.model';
import * as constants from '../models/constants';
import * as constant from '../models/constants.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  board: Board;

  constructor() {}

  ngOnInit() {
    console.log('testtt');
  }

  // get boardcells() {
  //   return this.board.rows;
  // }

  // headers = constants.headers;

  // rows = constants.rows;

  xDimension = constant.xDimension;
  yDimension = constant.yDimension;
  cells = constant.cells;

  // get getRows() {
  //   return this.cells.filter(x => x.x);
  // }

  // getHeader(x: string): string {
  //   if (!x) return '';
  //   const cell = this.yDimension[Number(x)];
  //   return cell ? cell : '';
  // }

  // getCell(x: string, y: string): string {
  //   const cell = this.cells.find(c => c.x == x && c.y == y);
  //   return cell ? cell.value : '';
  // }

  isShip(x: string, y: string): boolean {
    const cell = this.cells.find(c => c.x == x && c.y == y);
    return cell ? cell.isShip : false;
  }

  isHit(x: string, y: string): boolean {
    const cell = this.cells.find(c => c.x == x && c.y == y);
    return cell ? cell.isShip && cell.value == "hit" : false;
  }

  value(x: string, y: string): string {
    const cell = this.cells.find(c => c.x == x && c.y == y);
    if (cell) {
      switch(cell.value) {
        case "hit": return "X";
        case "miss": return "O"
        default: return ''
      }
    }
    return '';
  }

  click(x: string, y: string) {
    const cell = this.cells.find(c => c.x == x && c.y == y);
    if (cell) {
      cell.isShip = true;
    }
  }
}
