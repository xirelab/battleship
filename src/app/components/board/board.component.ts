import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Board } from '../../models/board.model';
import { Slot } from '../../models/slot.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  currentShip: number;
  numberOfcellSelected = 0;
  lastSelectedCell: Slot;
  secondLastSelectedCell: Slot;
  private _incoming: Slot;

  @Input() xDimension: Array<string>;
  @Input() yDimension: Array<string>;
  @Input() board: Board;
  @Input() type: string;
  @Input() numberofShips: number = 2;
  // @Input()
  // get incoming(): Slot {
  //   return this._incoming;
  // }
  // set incoming(value: Slot) {
  //   this._incoming = value;
  //   this.markOnBaord();
  // }

  @Output() shipSelected =  new EventEmitter<boolean>();

  constructor(public titleCasePipe: TitleCasePipe) {}

  ngOnInit() {
    console.log('testtt');
    this.currentShip = this.numberofShips;
  }

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
    const cell = this.board.cells.find(c => c.x === x && c.y === y);
    // return cell ? cell.isShip && this.type !== 'opponent': false;
    return cell ? cell.isShip : false;
  }

  isHit(x: string, y: string): boolean {
    const cell = this.board.cells.find(c => c.x === x && c.y === y);
    return cell ? cell.isShip && cell.value === 'hit' : false;
  }

  value(x: string, y: string): string {
    const cell = this.board.cells.find(c => c.x === x && c.y === y);
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

  isEnabled(x: string, y: string): boolean {
    if (this.type === 'opponent' || this.currentShip === 0) {
      return false;
    }
    if (this.numberOfcellSelected === 0) {
      return true;
    }
    if (this.isNextPossibleCell(x, y)) {
      return true;
    }
    return false;
  }

  click(x: string, y: string) {
    if (this.type === 'opponent' || !this.isEnabled(x, y)) {
      return;
    }
    const cell = this.board.cells.find(c => c.x === x && c.y === y);
    if (cell && cell.isShip) {
      return;
    }
    if (cell) {
      cell.isShip = true;
      this.secondLastSelectedCell = this.lastSelectedCell;
      this.lastSelectedCell = {x: x, y: y};
    }
    this.numberOfcellSelected += 1;
    if (this.numberOfcellSelected === this.currentShip + 1) {
      this.currentShip -= 1;
      this.numberOfcellSelected = 0;
    }
    if (this.currentShip === 0) {
      this.shipSelected.emit(true);
    }
  }

  isNextPossibleCell(x: string, y: string) {
    const cell = this.board.cells.find(c => c.x === x && c.y === y);
    if (cell && cell.isShip) {
      return false;
    }
    if (this.numberOfcellSelected !== 0 && this.numberOfcellSelected <= this.currentShip + 1 && this.lastSelectedCell) {
      if (this.lastSelectedCell) {
        const yIndex = this.yDimension.findIndex(i => i === y);
        const yBase = this.yDimension.findIndex(i => i === this.lastSelectedCell.y);

        if ((Number(x) === Number(this.lastSelectedCell.x) &&
              (yIndex - 1 === yBase || yIndex + 1 === yBase)) ||
            ((yIndex === yBase && (
              Number(x) + 1 === Number(this.lastSelectedCell.x) ||
              Number(x) - 1 === Number(this.lastSelectedCell.x))))) {
              return true;
        }
      }
    }
    return false;
  }

  // markOnBaord() {
  //   if (this._incoming) {
  //     console.log("markOnBaord");
  //     console.log(this._incoming);
  //     const cell = this.board.cells.find(c => c.x == this._incoming.x && c.y === this._incoming.y);
  //     if (cell) {
  //       cell.value = cell.isShip ? 'hit' : 'miss';
  //     }
  //   }    
  // }
}
