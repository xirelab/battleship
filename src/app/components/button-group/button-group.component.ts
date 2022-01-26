import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.css']
})
export class ButtonGroupComponent {

  @Input() canContinue: boolean;
  @Input() isTabletMode: boolean;
  @Input() lifes: number;
  @Output() onContinueClick = new EventEmitter<void>();
  @Output() onModeClick = new EventEmitter<void>();
  @Output() onHintClick = new EventEmitter<void>();
}
