import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notification-banners',
  templateUrl: './notification-banners.component.html',
  styleUrls: ['./notification-banners.component.scss']
})
export class NotificationBannersComponent {

  @Input() code: string | undefined | null;
  @Input() message: string | undefined | null;
  @Input() btn1Text: string | undefined | null;
  @Input() btn2Text: string | undefined | null;
  @Input() showInput: boolean = false;
  @Input() options: any[] = [];

  @Output() onNotificationBtnClick = new EventEmitter<any>();

  value: string = ''
  selectedOption: any = null;

  constructor() { }

  btn1Clicked() {
    this.onNotificationBtnClick.emit({
      code: this.code, isButton1Clicked: true, value: this.value, selectedOption: this.selectedOption
    });
  }

  btn2Clicked() {
    this.onNotificationBtnClick.emit({ code: this.code, isButton2Clicked: true });
  }
}
