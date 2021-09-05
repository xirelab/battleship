import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BattleShipComponent } from './battle-ship/battle-ship.component';
import { BoardComponent } from './board/board.component';
import { FireMissileComponent } from './fire-missile/fire-missile.component';
import { ModalPopupComponent } from './modal-popup/modal-popup.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [BrowserModule, FormsModule, MatDialogModule],
  declarations: [
    AppComponent,
    BattleShipComponent,
    BoardComponent,
    FireMissileComponent,
    ModalPopupComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
