import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { Cell } from 'src/app/models/cell.model';
import { Player } from 'src/app/models/player.model';
import { Board } from '../../models/board.model';
import { Slot } from '../../models/slot.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnChanges {
  currentShip: number;
  numberOfcellSelected = 0;
  lastSelectedCell: Cell;
  secondLastSelectedCell: Cell;
  firstCell: Cell;
  shouldUndo = false;
  isUndoActive = false;
  buildingShip: Cell[] = [];
  // private _incoming: Slot;

  @Input() xDimension: Array<string>;
  @Input() yDimension: Array<string>;
  @Input() player: Player;
  @Input() numberofShips: number = 2;
  @Input() showShips: boolean = true;
  @Input() isSystem: boolean = true;
  @Input() isBoardEnabled: boolean = false;
  @Output() selectedShip =  new EventEmitter<any>();
  @Output() allShipSelected =  new EventEmitter<boolean>();

  // @Input()
  // get incoming(): Slot {
  //   return this._incoming;
  // }
  // set incoming(value: Slot) {
  //   this._incoming = value;
  //   this.markOnBaord();
  // }  

  constructor(public titleCasePipe: TitleCasePipe) {}

  ngOnInit() {
    this.currentShip = this.numberofShips;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.currentShip = this.numberofShips;
  }

  get isCellEnabled() {
    return this.isSystem || this.currentShip !== 0 || !this.isBoardEnabled;
  }

  get shipDetails(): string {
    if (this.isSystem || this.currentShip === 0 || !this.isBoardEnabled) {
      return '';
    }
    if (this.currentShip === 1) 
      return `Select your last ship (${this.currentShip + 1} cells)..`;
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
        return 'fourth';
      case 5:
        return 'fifth';
      case 6:
        return 'sixth';
    }
  }

  shipPosition(x: string, y: string): string {
    const cell = this.player.board.cells.find(c => c.x === x && c.y === y);
    return cell && this.showShips ? cell.position : '';
  }

  isShip(x: string, y: string): boolean {
    const cell = this.player.board.cells.find(c => c.x === x && c.y === y);
    return this.showShips && cell ? cell.isShip : false;
  }

  isHit(x: string, y: string): boolean {
    const cell = this.player.board.cells.find(c => c.x === x && c.y === y);
    return cell ? cell.isShip && cell.value === 'hit' : false;
  }

  value(x: string, y: string): string {
    const cell = this.player.board.cells.find(c => c.x === x && c.y === y);
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
    if (this.isSystem || this.currentShip === 0) {
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
    if (this.isSystem && this.isBoardEnabled) {
      this.selectedShip.emit({x: x, y:y});
      return;
    }
    if (this.isSystem || !this.isEnabled(x, y) || !this.isBoardEnabled) {
      return;
    }
    const cell = this.player.board.cells.find(c => c.x === x && c.y === y);
    if (cell && cell.isShip) {
      return;
    }
    if (cell) {
      this.isUndoActive = true;
      cell.isShip = true;
      if (!this.secondLastSelectedCell && this.lastSelectedCell) {
        // first cell selection
        this.lastSelectedCell.position = 
          this.lastSelectedCell.x === cell.x  ? 
            (this.lastSelectedCell.y > cell.y ? 'bottom' : 'top') :
            (this.lastSelectedCell.x > cell.x && +x < 10 ? 'right' : 'left');
      }
      if (this.lastSelectedCell) {
        // last
        if (this.numberOfcellSelected === this.currentShip) {
          cell.position = this.lastSelectedCell.x === cell.x  ? 
          (this.lastSelectedCell.y > cell.y ? 'top' : 'bottom') :
          (this.lastSelectedCell.x > cell.x && +x < 10 ? 'left' : 'right');
        }
        
        //middle
        if (this.numberOfcellSelected < this.currentShip) {
          cell.position = this.lastSelectedCell.x === cell.x  ? 'vertical' : 'horizontal';
        }
      }
      if (!this.lastSelectedCell) {
        this.firstCell = cell;
        this.buildingShip = [];
      }
      this.buildingShip.push(cell);
      this.secondLastSelectedCell = this.lastSelectedCell;
      this.lastSelectedCell = cell; // {x: x, y: y};
    }
    this.numberOfcellSelected += 1;
    if (this.numberOfcellSelected === this.currentShip + 1) {
      this.currentShip -= 1;
      this.numberOfcellSelected = 0;
      this.lastSelectedCell = null;
      this.shouldUndo = false;
      // this.buildingShip = [];
    }
    if (this.currentShip === 0) {
      this.allShipSelected.emit(true);
    }
  }

  isNextPossibleCell(x: string, y: string): boolean {
    const cell = this.player.board.cells.find(c => c.x === x && c.y === y);
    if (cell && cell.isShip) {
      return false;
    }
    
    if (this.numberOfcellSelected !== 0 && this.numberOfcellSelected <= this.currentShip + 1 && this.lastSelectedCell) {
      const yIndex = this.yDimension.findIndex(i => i === y);
      const yBase = this.yDimension.findIndex(i => i === this.lastSelectedCell.y);
      
      if (this.secondLastSelectedCell && this.lastSelectedCell) {
        if (this.secondLastSelectedCell.x == this.lastSelectedCell.x && this.lastSelectedCell.x == x) {
          if (yIndex - 1 == yBase && yIndex >= 9) this.enableUndo();
          return yIndex - 1 == yBase || yIndex + 1 == yBase; //|| yIndex + 1 == +this.firstCell.y; 
        }
        if (this.secondLastSelectedCell.y == this.lastSelectedCell.y && this.lastSelectedCell.y == y) {
          if (+x - 1 == +this.lastSelectedCell.x && +x >= 10) this.enableUndo();
          return +x - 1 == +this.lastSelectedCell.x || +x + 1 == +this.lastSelectedCell.x; // || +x + 1 == +this.firstCell.x;
        }
      }
      else if (this.lastSelectedCell) {
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

  enableUndo() {
    this.shouldUndo = true;
    setTimeout(() =>
    {        
      this.shouldUndo = false;
    }, 5000);
  }

  onUndoClick() {
    this.shouldUndo = false;
    this.isUndoActive = false;

    if (this.buildingShip) {
      this.buildingShip.forEach(ship => {
        const s = this.player.board.cells.find(cell => cell.x == ship.x && cell.y == ship.y);
        if (s) { 
          s.isShip = false;
          s.position = '';
        }
      });
      if (this.numberOfcellSelected == 0) 
        this.currentShip += 1;
      this.numberOfcellSelected = 0;
      this.lastSelectedCell = null;
    }
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
