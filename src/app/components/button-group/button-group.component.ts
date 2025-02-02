import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.css']
})
export class ButtonGroupComponent implements OnInit, OnChanges {

  @Input() canContinue: boolean | undefined;
  @Input() isTabletMode: boolean | undefined;
  @Input() lifes: number | undefined;
  @Input() level: number | undefined;
  @Input() displayMode: string | undefined;
  @Input() headings: any;

  @Output() onContinueClick = new EventEmitter<void>();
  @Output() onModeClick = new EventEmitter<void>();
  @Output() onHintClick = new EventEmitter<void>();
  @Output() onMenuClick = new EventEmitter<void>();

  url: any;

  ngOnInit() {
    this.url = this.headings?.burgerMenu?.url
  }

  ngOnChanges() {
    this.url = this.headings?.burgerMenu?.url
  }
}
