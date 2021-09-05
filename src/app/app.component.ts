import { Component, OnInit, VERSION } from '@angular/core';
import { Board } from './models/board.model';
import { BoardService } from './services/board.service';
import { ModalService } from './services/modal.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ModalPopupComponent } from './modal-popup/modal-popup.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  numberOfCells = 10;
  numberOfShips = 3;

  xDimension: Array<string>;
  yDimension: Array<string>;
  boardOpponent = new Board(this.numberOfCells);
  boardMyteam = new Board(this.numberOfCells);

  constructor(public boardService: BoardService, public dialog: MatDialog) {}

  ngOnInit() {
    // this.modalService.open();
    this.xDimension = this.boardService.getXdimension(this.numberOfCells);
    this.yDimension = this.boardService.getYdimension(this.numberOfCells);

    this.boardService.initializeOpponent(
      this.boardOpponent,
      this.numberOfShips
    );

    // this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalPopupComponent, {
      width: '250px',
      data: ""
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed. data : ' + result);
      // this.animal = result;
    });
  }
}
