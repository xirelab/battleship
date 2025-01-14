import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BoardState } from 'src/app/store/board.state';
import { Constants } from 'src/app/utils/constants';
import * as actions from '../../store/board.action';
import { CookieManagementService } from 'src/app/services/cookie.service';

@Component({
  selector: 'app-game-selection',
  templateUrl: './game-selection.component.html',
  styleUrls: ['./game-selection.component.scss']
})
export class GameSelectionComponent {
  isStartArrange = false
  isReadName = false
  isReadNumnerOfShips = false
  isReadNumnerOfPlayers = false
  interval: any;
  playerName: string = '';
  numberofShips = Constants.defaultNumberOfShips
  numberOfPlayers: number = 1;

  @Input() user_cookie: any;
  @Output() isStartedChange = new EventEmitter<boolean>();

  constructor(
    private store: Store<BoardState>,
    private cookieManagementService: CookieManagementService
  ) { }

  quickStart() {
    this.store.dispatch(actions.SetPlayerType({ isSingleUser: true }));
    this.store.dispatch(actions.SetMyName({ name: 'GUEST' }));
    this.store.dispatch(actions.SetNumberofShips({ count: Constants.defaultNumberOfShips }));

    this.startGame();
  }

  gamePlay() {
    this.checkForname();
  }

  checkForname() {
    if (this.user_cookie && this.user_cookie.name) this.playerName = this.user_cookie.name;
    this.isReadName = true;
  }

  checkForNumberOfShips() {
    if (this.user_cookie && this.user_cookie.ships) this.numberofShips = this.user_cookie.ships;
    this.isReadNumnerOfShips = true;
  }

  checkForNumberOfPlayers() {
    // if (this.user_cookie && this.user_cookie.playerType) {
    //   this.store.dispatch(actions.SetPlayerType({ isSingleUser: this.user_cookie.playerType === 'single' }));
    //   this.startGame();
    // }
    // else {
    //   this.isReadNumnerOfPlayers = true;
    // }
    this.isReadNumnerOfPlayers = true;
  }

  // Action items

  onNameEnter() {
    this.store.dispatch(actions.SetMyName({ name: this.playerName }));
    this.user_cookie.name = this.playerName;
    this.isReadName = false;
    this.checkForNumberOfShips();
  }

  onNumberOfShipsEnter() {
    this.store.dispatch(actions.SetNumberofShips({ count: this.numberofShips }));
    this.user_cookie.ships = this.numberofShips;
    this.isReadNumnerOfShips = false;
    this.checkForNumberOfPlayers();
  }

  onNumberOfPlayerssEnter(isSingle: boolean) {
    this.store.dispatch(actions.SetPlayerType({ isSingleUser: isSingle }));
    this.user_cookie.playerType = isSingle ? 'single' : 'multi';
    this.isReadNumnerOfPlayers = false;
    this.startGame();
  }

  private startGame() {
    this.isStartArrange = true;
    this.interval = setInterval(() => {
      this.isStartArrange = false;
      clearInterval(this.interval);
      this.cookieManagementService.setDefaultMode(this.user_cookie);
      this.isStartedChange.emit(true);
    }, 1000)
  }
}
