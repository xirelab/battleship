import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Board } from './models/board.model';
import { BoardService } from './services/board.service';
import { ModalPopupComponent } from './components/modal-popup/modal-popup.component';
import { select, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { BoardState } from './store/board.state';
import * as actions from './store/board.action';
import * as selector from './store/board.selector';
import { ContentfulService } from './services/contentful.service';
import { CookieManagementService } from './services/cookie.service';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  contents: any;
  isGameFinished = false;
  isShipArranged = false;
  myBoard: Board | undefined;
  currentPlayer: string = '';
  canContinue = false;
  canShowShips = false;
  isSinglePlayer = false;
  isTabletMode = true;
  isMyTurn = false;
  level = 1;
  iWon = false;
  theme = 3;
  user_cookie: any;
  displayMode = 'web';
  displaySpinner = false;
  spinnerMessage = '';

  me$ = this.store.pipe(select(selector.me));
  opponent$ = this.store.pipe(select(selector.opponent));
  numberOfShips$ = this.store.pipe(select(selector.numberOfShips));
  xDimension$ = this.store.pipe(select(selector.xDimension));
  yDimension$ = this.store.pipe(select(selector.yDimension));
  currentPlayer$ = this.store.pipe(select(selector.currentPlayer));
  gameStatus$ = this.store.pipe(select(selector.gameStatus));

  @ViewChild('slickModal')
  slickModal: SlickCarouselComponent | undefined;

  constructor(
    private boardService: BoardService,
    private dialog: MatDialog,
    private store: Store<BoardState>,
    private actions$: Actions,
    // private cookieService: CookieService,
    private contentful: ContentfulService,
    private cookieManagementService: CookieManagementService
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

    this.contentful.getContent_GraphQl().then(res => {
      this.contents = res;
    });

    this.store.dispatch(actions.initializeBoard());

    if (this.user_cookie) this.store.dispatch(actions.SetNumberofShips({count: +this.user_cookie.ships}));

    this.currentPlayer$.subscribe(user=> this.processCurrestUser(user || ''));

    this.gameStatus$.subscribe((player: string) => {
      if(player) {
        this.iWon = player === 'Me';
        this.isGameFinished = true;
        this.canContinue = false;
        this.openDialog(!this.iWon ? `${player} won` : `Congratulations you won`, false, 'GameFinish', '', 
          (!this.iWon ? 'Challenge again' : (this.level == 3 ? 'Restart' : 'Next Level')), 'Exit');
      } 
    });

    this.openDialog('Please select the players', false, 'playerSelection', '', 'Single Player', 'Two Player');
  }

  getDefaultValues() {
    this.user_cookie = this.cookieManagementService.getDefaultValues();
    this.isTabletMode = this.user_cookie.mode === 'tablet';
    this.theme = this.user_cookie.theme ? this.user_cookie.theme : 1;
    if (this.displayMode === 'tablet') this.isTabletMode = true;
  }

  get headings() {
    // console.log(this.contents.data.battleshipCollection.items[0])
    if (this.contents) {
      return this.contents.data.battleshipCollection.items[0];
    }
  }

  get bkUrl(): any {
    if (this.contents && this.theme == 1) {
      const styles = {
        'background-image': 'url(' + this.headings.backgound.url + ')'
      };
      console.log(styles);
      return styles;
    }
    if (this.contents && this.theme == 3) {
      const styles = {
        'background-color': '#2d94e9'
      };
      console.log(styles);
      return styles;
    }
  }

  isInvalid = false;
  processCurrestUser(user: string) {
    if (this.currentPlayer !== user) {
      this.currentPlayer = user;
      let timebreak = this.isTabletMode ? 0 : 500;
      setTimeout(() =>
      {
        switch (user) {
          case 'Me': 
            if (this.isTabletMode || this.isInvalid) {
              this.isMyTurn = true;
              this.isInvalid = false;
            } else {
              this.openDialog('Please enter your cordinates', true, 'fire'); 
            }
            break;
          case 'Invalid':
            if (!this.isTabletMode) { 
              this.openDialog('Invalid entry! Please re-enter your cordinates', true, 'fire'); 
            }
            this.isInvalid = true;
            this.store.dispatch(actions.SetCurrentPlayer({player: 'Me'}));
            break;
          case 'Exists': 
            if (!this.isTabletMode) {
              this.openDialog('Already hit! Please re-enter your cordinates', true, 'fire'); 
            }
            this.isInvalid = true;
            this.store.dispatch(actions.SetCurrentPlayer({player: 'Me'}));
            break;
          case 'Opponent':
            const slot = this.triggerSystemFire();
            if (this.displayMode == 'web') {
              if (this.isTabletMode) {
                this.store.dispatch(actions.dropMissile({data: slot}));
              } else {
                this.openDialog('Opponent fired the cordinates:' + slot, false, 'fire', slot);
              }
            } else {
              this.slickModal?.slickGoTo(1);
              setTimeout(() => {        
                this.store.dispatch(actions.dropMissile({data: slot}));
                setTimeout(() => {
                  this.slickModal?.slickGoTo(0);
                }, 500);
              }, 500);
            }
            break;
        }
      }, timebreak);
    }
  }

  triggerSystemFire() {
    return this.level === 1 ?
     this.boardService.triggerSystemFire_Level1(this.myBoard) :
     this.boardService.triggerSystemFire_Level2(this.myBoard);
  }

  allShipSelected($event: boolean, myBoard: Board | undefined) {
    if ($event) {
      this.myBoard = myBoard;
      this.isShipArranged = true;
      this.canContinue = this.isTabletMode;
      this.store.dispatch(actions.prepareSystemBoard());
      this.displaySpinner = true;
      this.spinnerMessage = "let opponent arrange their ships";
      setTimeout(() => {
        this.displaySpinner = false;
        this.openDialog(this.isTabletMode ? 'Start tick the opponnent ships..' : 'Lets start the game.', false, 'startHit');
      }, 2000); 
    }
  }

  private openDialog(
    message: string, 
    isInputVisisble: boolean, 
    type: string = '', 
    value: string = '', 
    button1text: string = 'OK', 
    button2text: string = ''
  ): void {
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
          this.setplayerName(result);
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
        case 'startHit':
          this.processCurrestUser('Me');
          break;
        case'modeToTablet' : 
          // do nothing
          this.isMyTurn = true;
          break
        case 'modeToClassic' :
          this.onContinueClick();
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
            if (this.iWon) this.level += 1;
            if (this.level >= 4) this.restartGame(); 
            else this.nextLevel();
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
            this.cookieManagementService.setDefaultMode(this.user_cookie);
            this.store.dispatch(actions.ResetLifes());
            this.store.dispatch(actions.SetNumberofShips({count: result.value}));
            this.openDialog('Lets start arranging our ships..', false, 'arrangeShip');
          }
          break;
        case 'modeChanged':
          this.isTabletMode = Boolean(result.isButton1Clicked);
          this.user_cookie.mode = result.isButton1Clicked ? 'tablet' : 'classic';
          this.cookieManagementService.setDefaultMode(this.user_cookie);
          break;
        case 'profileUpdate':
          this.setplayerName(result);
          break;
        case 'theme':
          if((this.theme == 1 && result.isButton1Clicked) || (this.theme == 3 && result.isButton2Clicked))
            this.theme = 2;
          else if((this.theme == 1 && result.isButton2Clicked) || (this.theme == 2 && result.isButton2Clicked))
            this.theme = 3;
          else if((this.theme == 2 && result.isButton1Clicked) || (this.theme == 3 && result.isButton1Clicked))
            this.theme = 1;
          this.user_cookie.theme = this.theme;
          this.cookieManagementService.setDefaultMode(this.user_cookie);
          break;
        default : break;
      }
    });
  }

  onContinueClick() {
    this.canContinue = false;
    this.openDialog('Please enter your cordinates', true, 'fire');
  }

  onHintClick() {
    this.canShowShips = true;
    this.store.dispatch(actions.ReduceOneLife());
    this.slickModal?.slickGoTo(0);
    setTimeout(() =>
    {        
      this.canShowShips = false;
    }, 600);
  }

  onModeClick() {
    this.isTabletMode = !this.isTabletMode;
    if(this.isTabletMode) {
      this.user_cookie.mode = 'tablet';
      this.cookieManagementService.setDefaultMode(this.user_cookie);
      this.openDialog('Cool.. Now you can select opponent ship by clicking on it..', false, 'modeToTablet');
    } else {
      this.isMyTurn = false;
      this.user_cookie.mode = 'classic';
      this.cookieManagementService.setDefaultMode(this.user_cookie);
      this.openDialog('Changed to classic mode. You can hit by entering the cordinates..', false, 'modeToClassic');
    }
  }

  selectedShip($event: any) {
    if ($event) {
      console.log(`${$event.x}${$event.y}`);
      this.isMyTurn = false;
      this.store.dispatch(actions.dropMissile({data: `${$event.x}${$event.y}`}));
    }
  }

  setplayerName(result: any) {
    const myname = result.value ? result.value.toString() : 'Player1';
    this.user_cookie.name = myname;
    this.cookieManagementService.setDefaultMode(this.user_cookie);
    this.store.dispatch(actions.SetMyName({name: myname}));
  }

  restartGame() {
    this.level = 1
    this.canShowShips = false;
    this.isShipArranged = false;
    this.store.dispatch(actions.RestartGame());
    this.openDialog('Please select the players', false, 'playerSelection', '', 'Single Player', 'Two Player');        
  }

  nextLevel() {
    this.canShowShips = false;
    this.isShipArranged = false;
    this.store.dispatch(actions.NextLevel());
    this.openDialog('Lets start arranging our ships..', false, 'arrangeShip');   
  }

  gearClicked($event: any) {
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
      case 'profile':
        this.openDialog('Please enter your name', true, 'profileUpdate', '', 'Ok', 'Cancel');
        break;
      case 'theme':
        if (this.theme == 1) { // background
          this.openDialog('Select your option', false, 'theme', '', 'Light mode', 'Dark mode');
        } else if (this.theme == 2) {  // Light mode
          this.openDialog('Select your option', false, 'theme', '', 'Backgound', 'Dark mode');
        } else if (this.theme == 3) {  // Dark mode
          this.openDialog('Select your option', false, 'theme', '', 'Backgound', 'Light mode');
        }
        break;
      case 'help':
        this.openDialog('Help content goes here.. To be updated', false, 'help');
        break;
      default: break;
    }
  }

  @HostListener('window:resize')
  onWindowsResize() {
    this.configureDisplayMode();
  }

  @HostListener('window:load')
  onWindowsLoad() {
    this.configureDisplayMode();
  }

  configureDisplayMode() {
    this.displayMode = window.innerWidth <= 1030 ? 'tablet' : 'web';
    if (this.displayMode === 'tablet') this.isTabletMode = this.isMyTurn = true;
  }

  slideConfig = {
    slidesToShow: 1, slidesToScroll: 2, 
    centerMode: true, centerPadding: '1px', 
    arrows: true, dots: true,
    mobileFirst: true, infinite: false, 
    responsive: [{ breakpoint: window.innerWidth}]};
  
  slides = [342, 453] //, 846, 855, 234, 564, 744, 243];

  slickInit(e: any) { }

  breakpoint(e: any) { }

  afterChange(e: any) { }

  beforeChange(e: any) { }
}
