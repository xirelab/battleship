import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BattleShipComponent } from './battle-ship/battle-ship.component';
import { BoardComponent } from './board/board.component';
import { FireMissileComponent } from './fire-missile/fire-missile.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [
    AppComponent,
    BattleShipComponent,
    BoardComponent,
    FireMissileComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
