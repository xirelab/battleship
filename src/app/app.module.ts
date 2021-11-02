import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { ModalPopupComponent } from './components/modal-popup/modal-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { AlphaNumericDirective } from './directives/alpha-numeric.directive';
import { BoardEffects } from './store/board.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { boardReducer } from './store/board.reducer';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    // ActivatedRoute,
    EffectsModule.forRoot([]),
    StoreModule.forRoot([]),
    EffectsModule.forFeature([BoardEffects]),
    StoreModule.forFeature('board', boardReducer),
    StoreModule.forRoot(boardReducer, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      }
    }),
  ],
  declarations: [
    AppComponent,
    BoardComponent,
    ModalPopupComponent,
    AutoFocusDirective,
    AlphaNumericDirective,
    HeaderComponent
  ],
  exports: [
    // AutoFocusDirective,
    AlphaNumericDirective,
    // ActivatedRoute
  ],
  providers: [TitleCasePipe, AsyncPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
