import { Component, OnInit, VERSION } from '@angular/core';
import { Board } from './models/board.model';
import { BoardService } from './services/board.service';
import { ModalService } from './services/modal.service';
import { ModalPopupComponent } from './modal-popup/modal-popup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Slot } from './models/slot.model';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  numberOfCells = 10;
  numberOfShips = 2;
  myFiring: Slot;
  systemFiring: Slot;
  currentPlayer: string = '';
  gameFinished = false;

  xDimension: Array<string>;
  yDimension: Array<string>;
  boardOpponent = new Board(this.numberOfCells);
  boardMyteam = new Board(this.numberOfCells);

  constructor(public boardService: BoardService, public dialog: MatDialog) {}

  ngOnInit() {
    this.xDimension = this.boardService.getXdimension(this.numberOfCells);
    this.yDimension = this.boardService.getYdimension(this.numberOfCells);

    this.boardService.initializeOpponent(
      this.boardOpponent,
      this.numberOfShips
    );

    this.openDialog("Lets start with arrange our ships..", false);
  }

  shipSelected($event: boolean) {
    if ($event) {
      this.currentPlayer = "Me";
      this.openDialog("Please enter your cordinates", true);
    }
  }

  openDialog(message: string, isInputVisisble: boolean): void {
    const dialogRef = this.dialog.open(ModalPopupComponent, {
      width: '300px',
      // disableClose: true,
      data: {
        isInputVisisble: isInputVisisble, 
        caption: message, 
        value: ""
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      let fired = false;
      if (this.gameFinished) {return;}
      if (result && result.value) {
        console.log('The dialog was closed. data : ' + result.value);
        let xValue = result.value.substr(0,1);
        let yValue = '';
        if (xValue === "1") {
          xValue = result.value.substr(0,2);
          yValue = result.value.substr(2,1);
        } else {
          yValue = result.value.substr(1,1);
        }
        
        const cell = this.boardOpponent.cells.find(i => i.x === xValue && i.y === yValue);
        if (!cell) {
          fired = true;
          this.openDialog("Invalid entry! Please re-enter your cordinates", true);
        } else if (cell && !cell.value) {
          this.myFiring = { x: xValue, y: yValue}
        } else {
          fired = true;
          this.openDialog("Already hit! Please re-enter your cordinates", true);
        }
      }
      
      if (!fired && this.currentPlayer === 'Me') {
        if (this.boardService.checkResult(this.boardOpponent)) {
          this.gameFinished = true;
          this.openDialog("You Win", false);
        } else {
          setTimeout(() => 
          {
            this.currentPlayer = 'System'
            this.systemFiring = this.boardService.triggerSystemFire(this.boardMyteam);
            if (this.systemFiring) {
              this.openDialog(`System fired the cordinates: ${this.systemFiring.x}${this.systemFiring.y}`, false);
            }            
          },
          1000);
        }        
      } else if(this.currentPlayer === 'System') {
        if (this.boardService.checkResult(this.boardMyteam)) {
          this.gameFinished = true;
          this.openDialog("System Win", false);
        } else {
          setTimeout(() => 
          {
            this.currentPlayer = 'Me';
            this.shipSelected(true);
          },
          1000);
        }        
      }      
    });
  }
}
