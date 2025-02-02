import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { TitleCasePipe } from '@angular/common';
import { BoldPipe } from 'src/app/utils/bold.pipe';

@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.css']
})
export class BoardHeaderComponent {

  @Input() player: Player | undefined | null;
  @Input() isSystem: boolean = true;

  constructor(public titleCasePipe: TitleCasePipe) {}

  get playerTitle() {
    return this.titleCasePipe.transform(this.player?.name || '') + ' (' + (this.isSystem ? 'Opponent' : 'You') + ')';
  }
}
