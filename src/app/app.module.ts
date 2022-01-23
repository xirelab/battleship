import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatNativeDateModule, MatCommonModule } from '@angular/material/core';
import { SettingsComponent } from './components/settings/settings.component';
// import { MatIconModule } from '@angular/material';
import {MatMenuModule} from '@angular/material/menu'
import { BoldPipe } from './utils/bold.pipe';
import { CookieService } from 'ngx-cookie-service';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    // MatIconModule,
    MatMenuModule,
    MatCommonModule,
    MatButtonModule,
    MatDialogModule,
    MatNativeDateModule,
    // MaterialExampleModule,
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
    SlickCarouselModule
  ],
  declarations: [
    AppComponent,
    BoardComponent,
    ModalPopupComponent,
    AutoFocusDirective,
    AlphaNumericDirective,
    HeaderComponent,
    SettingsComponent,
    BoldPipe
  ],
  exports: [
    // AutoFocusDirective,
    AlphaNumericDirective,
    // ActivatedRoute
  ],
  providers: [
    TitleCasePipe,
    AsyncPipe,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
