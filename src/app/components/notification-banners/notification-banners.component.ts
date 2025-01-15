import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notification-banners',
  templateUrl: './notification-banners.component.html',
  styleUrls: ['./notification-banners.component.scss']
})
export class NotificationBannersComponent {
  
  @Input() message: string | undefined | null;
  @Input() btn1Text: string | undefined | null;
  @Input() btn2Text: string | undefined | null;

  constructor() { }

  btn1Clicked() {
    console.log('Button 1 clicked');
  }

  btn2Clicked() {
    console.log('Button 2 clicked');
  }
}
