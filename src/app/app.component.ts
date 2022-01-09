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
import { CookieService } from 'ngx-cookie-service';

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
  isTabletMode = true;
  isMyTurn = false; 
  user_cookie: any;

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
    private cookieService: CookieService
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

    this.getDefaultValues();

    this.store.dispatch(actions.initializeBoard());

    this.currentPlayer$.subscribe((user: string) => this.processCurrestUser(user));
    this.gameStatus$.subscribe((player: string) => {
      if(player) {
        this.isGameFinished = true;
        this.canContinue = false;
        if (player === 'Opponent') {
          this.openDialog(`${player} won`, false, 'GameFinish', '', 'Challenge again', 'Enough for now');  
        } else {
          this.openDialog(`Congratulations ${player} won`, false, 'GameFinish', '', 'Restart', 'Enough for now');
        }
      } 
    });

    this.openDialog('Please select the players', false, 'playerSelection', '', 'Single Player', 'Two Player');
  }

  getDefaultValues() {
    const user = this.cookieService.get('user_cookie');
    if(!user) {
      this.user_cookie = {
        name: '',
        mode: 'tablet',
        ships: 3
      };
      this.setDefaultMode(this.user_cookie);
    } else {
      this.user_cookie = JSON.parse(user);  
    }
    this.isTabletMode = this.user_cookie.mode === 'tablet';
  }

  setDefaultMode = (user: any) => this.cookieService.set('user_cookie', JSON.stringify(user));

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
              this.openDialog('Please enter your cordinates', true, 'fire'); 
            }
            break;
          case 'Invalid': 
            this.openDialog('Invalid entry! Please re-enter your cordinates', true, 'fire'); 
            break;
          case 'Exists': 
            this.openDialog('Already hit! Please re-enter your cordinates', true, 'fire'); 
            break;
          case 'Opponent':
            const slot = this.boardService.triggerSystemFire(this.myBoard);
            if (this.isTabletMode) {
              this.store.dispatch(actions.dropMissile({data: slot}));
            } else {
              this.openDialog('Opponent fired the cordinates:' + slot, false, 'fire', slot);
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
      this.canContinue = this.isTabletMode;
      this.store.dispatch(actions.prepareSystemBoard());
      this.openDialog('Wait for Opponent to arrang the ships..', false, 'opponentShip'); 
    }
  }

  private openDialog(
    message: string, 
    isInputVisisble: boolean, 
    type: string = '', 
    value: string = '', 
    button1text: string = 'OK', 
    button2text: string = ''): void {
    const dialogRef = this.dialog.open(ModalPopupComponent, {
      width: '300px',
      autoFocus: true,
      disableClose: true,
      data: {
        isInputVisisble: isInputVisisble,
        caption: message,
        value: value,
        type: type,
        button1text: button1text,
        button2text: button2text ? button2text : (isInputVisisble ? 'Lets take a break' : ''),
        isCancelClicked: false,
        isButton1Clicked: false,
        isButton2Clicked: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed. data : ' + result.value);
      switch(type) {
        case 'playerSelection' :
          this.isSinglePlayer = result.isButton1Clicked;
          this.store.dispatch(actions.SetPlayerType({isSingleUser: result.isButton1Clicked}));
          if (this.user_cookie && this.user_cookie.name) {
            this.store.dispatch(actions.SetMyName({name: this.user_cookie.name}));
            if (this.isSinglePlayer) {
              this.openDialog('Lets start arranging our ships..', false, 'arrangeShip'); 
            } else {
              this.openDialog('Lets share this link with opponent (new link has to provide here..)', false, 'sharing');
            }
          } else {
            this.openDialog('Please enter your name', true, 'myName', '', 'Ok', 'Cancel');
          }
          break;
        case'myName' :
          const myname = result.value ? result.value.toString() : 'Player1';
          this.user_cookie.name = myname;
          this.setDefaultMode(this.user_cookie);
          this.store.dispatch(actions.SetMyName({name: myname}));
          if (this.isSinglePlayer) {
            this.openDialog('Lets start arranging our ships..', false, 'arrangeShip'); 
          } else {
            this.openDialog('Lets share this link with opponent (new link has to provide here..)', false, 'sharing');
          }
          break;
        case 'sharing':
          // yet to update. as of now only single player implmented
          this.openDialog('Lets start arranging our ships..', false, 'arrangeShip'); 
          break;
        case 'opponentShip' :
          if (this.isTabletMode) {
            this.openDialog('Start tick the opponnent ships..', false, 'startHit');
          } else {
            this.openDialog('Lets start the game.', false, 'startHit');
          }
          break;
        case 'startHit':
          this.processCurrestUser('Me');
          break;
        case'modeToTablet' : 
          // do nothing
          this.isMyTurn = true;
          break
        case 'modeToClassic' :
          this.canContinue = false;
          this.openDialog('Please enter your cordinates', true, 'fire');
          break;
        case 'fire' :
          if (result && result.isCancelClicked) {
            this.canContinue = true;
          } else {
            this.store.dispatch(actions.dropMissile({data: result.value.toString()}));
          }
          break;
        case 'GameFinish':
          if(result.isButton1Clicked) {
            this.restartGame();
          } else {
            // need to close the window..
          }
          break;
        case 'restart':
          if (result.isButton1Clicked) {
            this.restartGame();
          }
          break;
        case 'numberOfShips' :
            if (result && !result.isCancelClicked) {
              this.user_cookie.ships = result.value;
              this.setDefaultMode(this.user_cookie);
              this.store.dispatch(actions.ResetLifes());
              this.store.dispatch(actions.SetNumberofShips({count: result.value}));
              this.openDialog('Lets start arranging our ships..', false, 'arrangeShip');
            }
            break;
        case 'modeChanged':
          this.isTabletMode = Boolean(result.isButton1Clicked);
          this.user_cookie.mode = result.isButton1Clicked ? 'tablet' : 'classic';
          this.setDefaultMode(this.user_cookie);
          break;
        default : break;
      }
    });
  }

  onClickContinue() {
    this.canContinue = false;
    this.openDialog('Please enter your cordinates', true, 'fire');
  }

  onHintClick() {
    this.canShowShips = true;
    this.store.dispatch(actions.ReduceOneLife());
    setTimeout(() =>
      {        
        this.canShowShips = false;
      }, 2000);
  }

  onModeClick() {
    this.isTabletMode = !this.isTabletMode;
    if(this.isTabletMode) {
      this.user_cookie.mode = 'tablet';
      this.setDefaultMode(this.user_cookie);
      this.openDialog('Cool.. Now you can select opponent ship by clicking on it..', false, 'modeToTablet');
    } else {
      this.isMyTurn = false;
      this.user_cookie.mode = 'classic';
      this.setDefaultMode(this.user_cookie);
      this.openDialog('Changed to classic mode. You can hit by entering the cordinates..', false, 'modeToClassic');
    }
  }

  selectedShip($event) {
    if ($event) {
      console.log(`${$event.x}${$event.y}`);
      this.isMyTurn = false;
      this.store.dispatch(actions.dropMissile({data: `${$event.x}${$event.y}`}));
    }
  }

  restartGame() {
    this.isShipArranged = false;
    this.store.dispatch(actions.RestartGame());
    this.openDialog('Please select the players', false, 'playerSelection', '', 'Single Player', 'Two Player');        
  }

  gearClicked($event) {
    switch($event) {
      case 'ships':
        this.openDialog('Please enter desired number of Ships (this will restart your game)', true, 'numberOfShips', '', 'Ok', 'Cancel');
        break;
      case 'mode':
        this.openDialog('Please select the desired game mode (no restart required):', false, 'modeChanged', '', 'Tablet', 'Classic');
        break;
      case 'restart':
        this.openDialog('It will clear all data. Please confirm', false, 'restart', '', 'OK', 'Cancel');
        break;
      case 'help':
        this.openDialog('Help content goes here.. Tobe updated', false, 'help');
        break;
      default: break;
    }
  }
}
