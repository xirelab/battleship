import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  @Output() onClick =  new EventEmitter<void>();

  gearClicked() {
    this.onClick.emit();
  }

}
