import { Component, OnInit } from '@angular/core';
import { Board } from './models/board.model';
import { BoardService } from './services/board.service';
import { ModalPopupComponent } from './modal-popup/modal-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { BoardState } from './store/board.state';
import * as actions from './store/board.action';
import * as selector from './store/board.selector';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isGameFinished = false;
  myBoard: Board;
  currentPlayer: string = '';

  numberOfShips$ = this.store.pipe(select(selector.numberOfShips));
  xDimension$ = this.store.pipe(select(selector.xDimension));
  yDimension$ = this.store.pipe(select(selector.yDimension));
  myBoard$ = this.store.pipe(select(selector.myBoard));
  systemBoard$ = this.store.pipe(select(selector.systemBoard));
  currentPlayer$ = this.store.pipe(select(selector.currentPlayer));
  gameStatus$ = this.store.pipe(select(selector.gameStatus));

  constructor(
    private boardService: BoardService,
    private dialog: MatDialog,
    private store: Store<BoardState>,
    private actions$: Actions
  ) {}

  ngOnInit() {
    this.store.dispatch(actions.initializeBoard());

    this.currentPlayer$.subscribe((user: string) => this.processCurrestUser(user));
    this.gameStatus$.subscribe((player: string) => {
      if(player) {
        this.isGameFinished = true;
        this.openDialog(`Congratulations ${player} won`, false);
      } 
    });

    this.openDialog('Lets start arranging our ships..', false);
  }

  processCurrestUser(user: string) {
    if (this.currentPlayer !== user) {
      this.currentPlayer = user;
      setTimeout(() =>
      {        
        switch (user) {
          case 'Me': this.openDialog('Please enter your cordinates', true);break;
          case 'Me-Invalid': this.openDialog('Invalid entry! Please re-enter your cordinates', true); break;
          case 'Me-Exists': this.openDialog('Already hit! Please re-enter your cordinates', true); break;
          case 'System':
            const slot = this.boardService.triggerSystemFire(this.myBoard);
            this.openDialog('System fired the cordinates:', false, slot);
            break;
        }
      }, 500);
    }
  }

  allShipSelected($event: boolean, myBoard: Board) {
    if ($event) {
      this.myBoard = myBoard;
      this.store.dispatch(actions.prepareSystemBoard());
      this.processCurrestUser('Me');
    }
  }

  openDialog(message: string, isInputVisisble: boolean, value: string = ''): void {
    const dialogRef = this.dialog.open(ModalPopupComponent, {
      width: '300px',
      disableClose: true,
      data: {
        isInputVisisble: isInputVisisble,
        caption: message,
        value: value
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!this.isGameFinished && result && result.value) {
        console.log('The dialog was closed. data : ' + result.value);
        this.store.dispatch(actions.dropMissile({data: result.value.toString()}));
      }
    });
  }
}
