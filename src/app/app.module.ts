import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BattleShipComponent } from './battle-ship/battle-ship.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, BattleShipComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
