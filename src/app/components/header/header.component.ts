import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { TitleCasePipe } from '@angular/common';
import { BoldPipe } from 'src/app/utils/bold.pipe';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() player: Player;
  @Input() level: number = 1;

  constructor(public titleCasePipe: TitleCasePipe) {}
}
