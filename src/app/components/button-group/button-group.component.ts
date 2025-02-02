import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.css']
})
export class ButtonGroupComponent {

  @Input() canContinue: boolean | undefined;
  @Input() isTabletMode: boolean | undefined;
  @Input() lifes: number | undefined;
  @Input() level: number | undefined;
  
  @Output() onContinueClick = new EventEmitter<void>();
  @Output() onModeClick = new EventEmitter<void>();
  @Output() onHintClick = new EventEmitter<void>();
  @Output() onMenuClick = new EventEmitter<void>();
}
