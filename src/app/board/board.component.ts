import { Component, OnInit, Input } from '@angular/core';
import { Board } from '../models/board.model';
import * as constants from '../models/constants';
import * as constant from '../models/constants.model';
import { Slot } from '../models/slot.model';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  board: Board;
  currentShip: number;
  numberOfcellSelected = 0;
  lastSelectedCell: Slot;
  private _incoming: Slot;

  @Input() type: string;
  @Input() numberofShips: number = 2;
  @Input()
  get incoming(): Slot {
    return this._incoming;
  }
  set incoming(value: Slot) {
    this._incoming = value;
    this.markOnBaord();
  } 

  ngOnInit() {
    console.log('testtt');
    this.currentShip = this.numberofShips;
  }

  xDimension = constant.xDimension;
  yDimension = constant.yDimension;
  cells = constant.cells;

  get shipDetails(): string {
    if (this.type === 'opponent' || this.currentShip === 0) {
      return '';
    }
    return `Select ${this.count(this.numberofShips - this.currentShip + 1)} ship (${this.currentShip + 1} cells)..`;
  }

  private count(number: number): string {
    switch (number) {
      case 1:
        return 'first';
      case 2:
        return 'second';
      case 3:
        return 'third';
      case 4:
        return 'forth';
      case 5:
        return 'fifth';
    }
  }

  isShip(x: string, y: string): boolean {
    const cell = this.cells.find(c => c.x === x && c.y === y);
    return cell ? cell.isShip && this.type !== 'opponent': false;
  }

  isHit(x: string, y: string): boolean {
    const cell = this.cells.find(c => c.x === x && c.y === y);
    return cell ? cell.isShip && cell.value === 'hit' : false;
  }

  value(x: string, y: string): string {
    const cell = this.cells.find(c => c.x === x && c.y === y);
    if (cell) {
      switch (cell.value) {
        case 'hit':
          return 'X';
        case 'miss':
          return 'O';
        default:
          return '';
      }
    }
    return '';
  }

  isDisabled(x: string, y: string): boolean {
    if (this.type === 'opponent' || this.currentShip === 0) {
      return true;
    }
    if (this.numberOfcellSelected !== 0 && this.numberOfcellSelected <= this.currentShip + 1) { 
      // ship filling in progress
      // console.log(this.lastSelectedCell);
      // if (this.lastSelectedCell) {
      //   if (Number(x) > Number(this.lastSelectedCell.x) + 1 && 
      //       Number(x) < Number(this.lastSelectedCell.x) - 1 &&
      //       Number(y) > Number(this.lastSelectedCell.y) + 1 && 
      //       Number(y) < Number(this.lastSelectedCell.y) - 1 ) { 
      //         return true;
      //       }
      // }
    } 
    return false;
  }

  click(x: string, y: string) {
    if (this.type === 'opponent' || this.isDisabled(x, y)) {
      return;
    }
    const cell = this.cells.find(c => c.x === x && c.y === y);
    if (cell && cell.isShip) {
      return;
    }
    if (cell) {      
      cell.isShip = true;
      this.lastSelectedCell = {x: x, y: y};
    }
    this.numberOfcellSelected += 1;
    if (this.numberOfcellSelected === this.currentShip + 1) {
      this.currentShip -= 1;
      this.numberOfcellSelected = 0;
    }
  }

  markOnBaord() {
    const cell = this.cells.find(
      c => c.x == this._incoming.x && c.y === this._incoming.x
    );
    if (cell) {
      cell.value = cell.isShip ? 'hit' : 'miss';
    }
  }
}
