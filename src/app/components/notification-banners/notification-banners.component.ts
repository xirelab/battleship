import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notification-banners',
  templateUrl: './notification-banners.component.html',
  styleUrls: ['./notification-banners.component.scss']
})
export class NotificationBannersComponent {
  
  @Input() message: string | undefined | null;

  constructor() { }
}
