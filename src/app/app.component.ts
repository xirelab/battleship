import { Component, OnInit } from '@angular/core';
import { Board } from './models/board.model';
import { BoardService } from './services/board.service';
import { ModalPopupComponent } from './components/modal-popup/modal-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { BoardState } from './store/board.state';
import * as actions from './store/board.action';
import * as selector from './store/board.selector';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isGameFinished = false;
  isShipArranged = false;
  myBoard: Board;
  currentPlayer: string = '';
  canContinue = false;
  canShowShips = false;
  isSinglePlayer = false;
  isTabletMode = false;
  isMyTurn = false; 

  me$ = this.store.pipe(select(selector.me));
  opponent$ = this.store.pipe(select(selector.opponent));
  numberOfShips$ = this.store.pipe(select(selector.numberOfShips));
  xDimension$ = this.store.pipe(select(selector.xDimension));
  yDimension$ = this.store.pipe(select(selector.yDimension));
  // myBoard$ = this.store.pipe(select(selector.myBoard));
  // opponentBoard$ = this.store.pipe(select(selector.opponentBoard));
  currentPlayer$ = this.store.pipe(select(selector.currentPlayer));
  isSetupCompleted$ = this.store.pipe(select(selector.isSetupCompleted));
  gameStatus$ = this.store.pipe(select(selector.gameStatus));

  constructor(
    private boardService: BoardService,
    private dialog: MatDialog,
    private store: Store<BoardState>,
    private actions$: Actions,
    // private route: ActivatedRoute
  ) {
    // this.route.queryParams.subscribe(params => {
    //   console.log(params['param1']);
    //   console.log(params['param2']);
    // });
  }

  ngOnInit() {
    // const invitedby: string = this.route.snapshot.queryParamMap.get('invitedby');
    // console.log(invitedby);
    
    this.store.dispatch(actions.initializeBoard());

    this.currentPlayer$.subscribe((user: string) => this.processCurrestUser(user));
    this.gameStatus$.subscribe((player: string) => {
      if(player) {
        this.isGameFinished = true;
        this.canContinue = false;
        this.openDialog(`Congratulations ${player} won`, false);
      } 
    });

    this.openDialog('Please select the game mode', false, '', 'playerSelection');
  }

  processCurrestUser(user: string) {
    if (this.currentPlayer !== user) {
      this.currentPlayer = user;
      setTimeout(() =>
      {        
        switch (user) {
          case 'Me': 
            if (this.isTabletMode) {
              this.isMyTurn = true;
            } else {
              this.openDialog('Please enter your cordinates', true); 
            }
            break;
          case 'Invalid': this.openDialog('Invalid entry! Please re-enter your cordinates', true); break;
          case 'Exists': this.openDialog('Already hit! Please re-enter your cordinates', true); break;
          case 'Opponent':
            const slot = this.boardService.triggerSystemFire(this.myBoard);
            if (this.isTabletMode) {
              this.store.dispatch(actions.dropMissile({data: slot}));
            } else {
              this.openDialog('Opponent fired the cordinates:', false, slot);
            }
            break;
        }
      }, 500);
    }
  }

  allShipSelected($event: boolean, myBoard: Board) {
    if ($event) {
      this.myBoard = myBoard;
      this.isShipArranged = true;
      // this.canContinue = false;
      this.store.dispatch(actions.prepareSystemBoard());
      this.openDialog('Wait for Opponent to arrang the ships..', false, '', 'opponentShip'); 
    }
  }

  private openDialog(message: string, isInputVisisble: boolean, value: string = '', type: string = ''): void {
    const dialogRef = this.dialog.open(ModalPopupComponent, {
      width: '300px',
      autoFocus: true,
      disableClose: true,
      data: {
        isInputVisisble: isInputVisisble,
        caption: message,
        value: value,
        type: type
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!this.isGameFinished && result) {
        console.log('The dialog was closed. data : ' + result.value);
        if (type === 'playerSelection') {
          this.store.dispatch(actions.SetPlayerType({isSingleUser: result.value === 'single'}));
          if (result && result.value === 'single') {
            this.openDialog('Please enter your name', false, '', 'myName');
          } else {
            this.openDialog('Lets share this link with opponent', false, '', 'sharing');
          }
        } else if(type === 'sharing') {
          this.openDialog('Please enter your name', false, '', 'myName');
        } else if(type === 'myName' && result.value) {
          this.store.dispatch(actions.SetMyName({name: result.value.toString()}));
          this.openDialog('Lets start arranging our ships..', false, '', 'arrangeShip'); 
        } else if(type === 'opponentShip') {
          this.openDialog('Lets start the game..', false, '', 'startHit');
        } else if(type === 'startHit') {
          this.processCurrestUser('Me');
        } else if(type === 'gear') {
          if (result && result.value !== 'cancelled') {
            this.store.dispatch(actions.ResetLifes());
            this.store.dispatch(actions.SetNumberofShips({count: result.value}));
            this.openDialog('Lets start arranging our ships..', false, '', 'arrangeShip');
          }
        } else if(type === 'modeToTablet') {
          // do nothing
          this.isMyTurn = true;
        } else if(type === 'modeToClassic') {
          this.canContinue = false;
          this.openDialog('Please enter your cordinates', true);
        } else {
          if (result && result.value === 'break') {
            this.canContinue = true;
          } else {
            this.store.dispatch(actions.dropMissile({data: result.value.toString()}));
          }
        }
      }      
    });
  }

  onClickContinue() {
    this.canContinue = false;
    this.openDialog('Please enter your cordinates', true);
  }

  onHintClick() {
    this.canShowShips = true;
    this.store.dispatch(actions.ReduceOneLife());
    setTimeout(() =>
      {        
        this.canShowShips = false;
      }, 2000);
  }

  gearClicked() {
    this.openDialog('Please enter desired number of Ships (this will restart your game)', false, '', 'gear');
  }

  onModeClick() {
    this.isTabletMode = !this.isTabletMode;
    if(this.isTabletMode) {
      this.openDialog('Now you can select opponent ship by clicking on it..', false, '', 'modeToTablet');
    } else {
      this.isMyTurn = false;
      this.openDialog('Now changed to classic mode. You can enter the cordinates..', false, '', 'modeToClassic');
    }
  }

  selectedShip($event) {
    if ($event) {
      console.log(`${$event.x}${$event.y}`);
      this.isMyTurn = false;
      this.store.dispatch(actions.dropMissile({data: `${$event.x}${$event.y}`}));
    }
  }
}
