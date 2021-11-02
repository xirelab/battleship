import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() player: Player;

}
