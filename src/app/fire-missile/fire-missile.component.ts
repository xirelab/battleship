import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fire-missile',
  templateUrl: './fire-missile.component.html',
  styleUrls: ['./fire-missile.component.css']
})
export class FireMissileComponent  {

  @Output()
  cordinates = new EventEmitter();

}