import { Component, VERSION } from '@angular/core';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  
  constructor(public modalService: ModalService) {}
}
