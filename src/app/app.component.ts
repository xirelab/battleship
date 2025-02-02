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
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isStarted = false
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

  showMenu = false;
  notificationMessage = '';
  notificationCode = '';
  btn1Text = '';
  btn2Text = '';
  showInput = false;
  notificationOptions: any[] = [];

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

    this.currentPlayer$.subscribe(user => this.processCurrestUser(user || ''));

    this.gameStatus$.subscribe((player: string) => {
      if (player) {
        this.iWon = player === 'Me';
        this.isGameFinished = true;
        this.canContinue = false;

        this.showWarning(
          !this.iWon ? `${player} won` : `Congratulations you won`, 'GameFinish',
          !this.iWon ? 'Challenge again' : (this.level == 3 ? 'Restart' : 'Next Level'), 'Exit'
        );
      }
    });
  }

  getDefaultValues() {
    this.user_cookie = this.cookieManagementService.getDefaultValues();
    this.isTabletMode = this.user_cookie.mode === 'tablet';
    this.theme = this.user_cookie.theme ? this.user_cookie.theme : 1;
    if (this.displayMode === 'tablet') this.isTabletMode = true;
  }

  isStartedChangeed($event: boolean) {
    if ($event) {
      this.isStarted = false;
      this.showNotification('Lets start arranging our ships..', () => this.startGame());
    }
  }

  startGame() {
    this.isStarted = true;
    this.cookieManagementService.setDefaultMode(this.user_cookie);
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
      // console.log(styles);
      return styles;
    }
    if (this.contents && this.theme == 3) {
      const styles = {
        'background-color': '#2d94e9'
      };
      // console.log(styles);
      return styles;
    }
  }

  private showNotification(message: string, callbackMethod: () => void = () => { }, timer = 2000) {
    this.notificationMessage = message
    setTimeout(() => {
      this.notificationMessage = '';
      if (callbackMethod) callbackMethod();
    }, timer)
  }

  private showWarning(message: string, code = '', btn1Text = '', btn2Text = '', showInput = false, options: any[] = []) {
    this.notificationMessage = message
    this.notificationCode = code;
    this.btn1Text = btn1Text;
    this.btn2Text = btn2Text;
    this.showInput = showInput;
    this.notificationOptions = options;
  }

  isInvalid = false;
  processCurrestUser(user: string) {
    if (this.currentPlayer !== user) {
      this.currentPlayer = user;
      let timebreak = this.isTabletMode ? 0 : 500;
      setTimeout(() => {
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
            this.store.dispatch(actions.SetCurrentPlayer({ player: 'Me' }));
            break;
          case 'Exists':
            if (!this.isTabletMode) {
              this.openDialog('Already hit! Please re-enter your cordinates', true, 'fire');
            }
            this.isInvalid = true;
            this.store.dispatch(actions.SetCurrentPlayer({ player: 'Me' }));
            break;
          case 'Opponent':
            const slot = this.triggerSystemFire();
            if (this.displayMode == 'web') {
              if (this.isTabletMode) {
                this.store.dispatch(actions.dropMissile({ data: slot }));
              } else {
                this.openDialog('Opponent fired the cordinates:' + slot, false, 'fire', slot);
              }
            } else {
              this.slickModal?.slickGoTo(1);
              setTimeout(() => {
                this.store.dispatch(actions.dropMissile({ data: slot }));
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
        this.showNotification(
          this.isTabletMode ? 'Start tick the ship on the opponnent board..' : 'Lets start the game.',
          () => this.processCurrestUser('Me')
        )
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
      autoFocus: true,
      disableClose: true,
      panelClass: 'custom-modalbox',
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
      switch (type) {
        case 'fire':
          if (result && result.isCancelClicked) {
            this.canContinue = true;
          } else {
            this.store.dispatch(actions.dropMissile({ data: result.value.toString() }));
          }
          break;
        default: break;
      }
    });
  }

  onContinueClick() {
    this.canContinue = false;
    this.openDialog('Please enter your cordinates', true, 'fire');
  }

  onHintClick() {
    this.showNotification('This cost you a life..', () => this.showShips());
  }

  onMenuClick() {
    this.showMenu = !this.showMenu;
  }

  showShips() {
    this.canShowShips = true;
    this.store.dispatch(actions.ReduceOneLife());
    this.slickModal?.slickGoTo(0);
    setTimeout(() => {
      this.canShowShips = false;
    }, 600);
  }

  onModeClick(isTabletMode: boolean) {
    this.isTabletMode = isTabletMode;
    if (this.isTabletMode) {
      this.user_cookie.mode = 'tablet';
      this.cookieManagementService.setDefaultMode(this.user_cookie);
      this.isMyTurn = true;
      this.showNotification('Cool.. Now you can select opponent ship by clicking on it..');
    } else {
      this.isMyTurn = false;
      this.user_cookie.mode = 'classic';
      this.cookieManagementService.setDefaultMode(this.user_cookie);
      this.showNotification(
        'Changed to classic mode. You can hit by entering the cordinates..', () => this.onContinueClick()
      );
    }
  }

  selectedShip($event: any) {
    if ($event) {
      console.log(`${$event.x}${$event.y}`);
      this.isMyTurn = false;
      this.store.dispatch(actions.dropMissile({ data: `${$event.x}${$event.y}` }));
    }
  }

  setplayerName(result: any) {
    const myname = result ?? 'Player1';
    this.user_cookie.name = myname;
    this.cookieManagementService.setDefaultMode(this.user_cookie);
    this.store.dispatch(actions.SetMyName({ name: myname }));
  }

  restartGame() {
    this.level = 1
    this.canShowShips = false;
    this.isShipArranged = false;
    this.store.dispatch(actions.RestartGame());
    this.isStarted = false;
  }

  nextLevel() {
    this.canShowShips = false;
    this.isShipArranged = false;
    this.store.dispatch(actions.NextLevel());
    this.isStartedChangeed(true);
  }

  gearClicked($event: any) {
    this.showMenu = false;
    switch ($event) {
      case 'ships':
        this.showWarning('Please enter desired number of Ships (this will restart your game)', 'numberOfShips', 'Ok', 'Cancel', true)
        break;
      case 'mode':
        this.showWarning('Please select the desired game mode (no restart required)', 'modeChanged', 'Tablet', 'Classic');
        break;
      case 'restart':
        this.showWarning('It will clear all data. Please confirm', 'restart', 'Restart', 'Cancel');
        break;
      case 'profile':
        this.showWarning('Please enter your name (this will not restart your game)', 'profileUpdate', 'Ok', 'Cancel', true)
        break;
      case 'theme':
        let options = [{ value: 1, display: 'Background' }, { value: 2, display: 'Light mode' }, { value: 3, display: 'Dark mode' }];
        this.showWarning('Please select the theme (no restart required)', 'themeChange', 'Ok', 'Cancel', false, options);
        break;
      case 'help':
        this.showWarning('Help content goes here.. To be updated', 'help', 'Ok', 'Cancel');
        break;
      default: break;
    }
  }

  // Notification banner click events
  onNotificationBtnClicked($event: any) {
    if ($event?.code) {
      this.notificationMessage = '';
      this.notificationCode = '';
      this.btn1Text = '';
      this.btn2Text = '';
      this.showInput = false;
      this.notificationOptions = [];

      switch ($event.code) {
        case 'GameFinish':
          if ($event.isButton1Clicked) {
            if (this.iWon) this.level += 1;
            if (this.level >= 4) this.restartGame();
            else this.nextLevel();
          }
          break;
        case 'restart':
          if ($event.isButton1Clicked) {
            this.restartGame();
          }
          break;
        case 'numberOfShips':
          if ($event.isButton1Clicked) {
            this.user_cookie.ships = $event.value;
            this.cookieManagementService.setDefaultMode(this.user_cookie);
            this.store.dispatch(actions.ResetLifes());
            this.store.dispatch(actions.SetNumberofShips({ count: $event.value }));
            this.isStartedChangeed(true);
          }
          break;
        case 'profileUpdate':
          if ($event.isButton1Clicked) {
            this.setplayerName($event.value);
          }
          break;
        case 'modeChanged':
          this.onModeClick($event.isButton1Clicked);
          break;
        case 'themeChange':
          if ($event.isButton1Clicked) {
            this.theme = $event.selectedOption;
          }
          break;
        default: break;
      }
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
    responsive: [{ breakpoint: window.innerWidth }]
  };

  slides = [342, 453] //, 846, 855, 234, 564, 744, 243];

  slickInit(e: any) { }

  breakpoint(e: any) { }

  afterChange(e: any) { }

  beforeChange(e: any) { }
}
