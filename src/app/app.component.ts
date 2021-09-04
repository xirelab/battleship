import { Component, OnInit, VERSION } from '@angular/core';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  
  constructor(public modalService: ModalService) {}

  ngOnInit() {
    // this.modalService.open();
  }
} 
