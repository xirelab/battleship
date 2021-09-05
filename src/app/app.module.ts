import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { ModalPopupComponent } from './modal-popup/modal-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { AlphaNumericDirective } from './directives/alpha-numeric.directive';
import { BoardEffects } from './store/board.effects';
// import { BoardReducer } from './store/board.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { boardReducer } from './store/board.reducer';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot([]),
    EffectsModule.forFeature([BoardEffects]),
    StoreModule.forFeature('board', boardReducer),
    StoreModule.forRoot(boardReducer, {
      runtimeChecks: {
        // strictStateImmutability and strictActionImmutability are enabled by default
        // strictStateSerializability: true,
        // strictActionSerializability: true,
        // strictActionWithinNgZone: true,
        // strictActionTypeUniqueness: true,
        // if you want to change complexe objects and that we have. We need to disable these settings
        // change strictStateImmutability, strictActionImmutability
        strictStateImmutability: false, // set this to false
        strictActionImmutability: true,
      }
    }),
  ],
  declarations: [
    AppComponent,
    BoardComponent,
    ModalPopupComponent,
    AutoFocusDirective,
    AlphaNumericDirective,
    // AsyncPipe
  ],
  exports: [
    // AutoFocusDirective,
    AlphaNumericDirective
  ],
  providers: [TitleCasePipe, AsyncPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
