import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Menus } from 'src/app/models/constants.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  menus = Menus;
  @Input() level: number;
  @Output() onClick = new EventEmitter<string>();

  gearClicked(menu: string) {
    this.onClick.emit(menu);
  }

}
