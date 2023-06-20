import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() headings: any;
  @Input() level: number | undefined;
  @Output() onClick = new EventEmitter<string>();

  gearClicked($event: any) {
    this.onClick.emit($event);
  }
}
