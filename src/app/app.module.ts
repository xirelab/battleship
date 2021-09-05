import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { ModalPopupComponent } from './modal-popup/modal-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TitleCasePipe } from '@angular/common';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { AlphaNumericDirective } from './directives/alpha-numeric.directive';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule
  ],
  declarations: [
    AppComponent,
    BoardComponent,
    ModalPopupComponent,
    AutoFocusDirective,
    AlphaNumericDirective
  ],
  exports: [
    // AutoFocusDirective,
    AlphaNumericDirective
  ],
  providers: [TitleCasePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
