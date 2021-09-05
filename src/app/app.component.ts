import { Component, OnInit, VERSION } from '@angular/core';
import { Board } from './models/board.model';
import { BoardService } from './services/board.service';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  
  numberOfCells = 10;
  numberOfShips = 3;

  xDimension: Array<string>;
  yDimension: Array<string>;
  boardOpponent = new Board(this.numberOfCells);
  boardMyteam = new Board(this.numberOfCells);

  constructor(public boardService: BoardService, public modalService: ModalService) {}

  ngOnInit() {
    // this.modalService.open();
    this.xDimension = this.boardService.getXdimension(this.numberOfCells);
    this.yDimension = this.boardService.getYdimension(this.numberOfCells);

    this.boardService.initializeOpponent(this.boardOpponent, this.numberOfShips);
  }
} 
