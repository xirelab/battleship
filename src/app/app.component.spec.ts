import { waitForAsync, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { AppComponent } from './app.component';
import { BoardState } from './store/board.state';
import { Store, StoreModule } from '@ngrx/store';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Board } from './models/board.model';
import { EffectsModule } from '@ngrx/effects';
import { boardReducer } from './store/board.reducer';
import { BoardComponent } from './components/board/board.component';
import { ModalPopupComponent } from './components/modal-popup/modal-popup.component';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { AlphaNumericDirective } from './directives/alpha-numeric.directive';
import { AsyncPipe, TitleCasePipe } from '@angular/common';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeAll((done) => (async () => {
    TestBed.configureTestingModule({
      declarations: [ 
        AppComponent,
        BoardComponent,
        ModalPopupComponent,
        AutoFocusDirective,
        AlphaNumericDirective
      ],
      imports: [
        EffectsModule.forRoot([]),
        StoreModule.forRoot([]),
        StoreModule.forFeature('board', boardReducer),
        MatDialogModule
      ],
      providers: [
        TitleCasePipe, 
        AsyncPipe,
        MatDialog,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} } 
      ]
    });
    await TestBed.compileComponents();
  })().then(done).catch(done.fail));

  // beforeAll(waitForAsync(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ AppComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch on load', inject([Store], (store: Store<BoardState>) => {
      // Arrange
      spyOn(store, 'dispatch');

      // Act
      component.ngOnInit();

      // Assert
      expect(store.dispatch).toHaveBeenCalled();
    }));
  })

  describe('processCurrestUser', () => {
    it('should open modal popup', inject([MatDialog], (modal: MatDialog) => {
      // Arrange
      spyOn(modal, 'open');
      component.currentPlayer = "System";

      // Act
      component.processCurrestUser('Me');

      // Assert
      expect(modal.open).toHaveBeenCalled();
    }));

    it('should not open modal popup', inject([MatDialog], (modal: MatDialog) => {
      // Arrange
      spyOn(modal, 'open');
      component.currentPlayer = "System";

      // Act
      component.processCurrestUser('System');

      // Assert
      expect(modal.open).not.toHaveBeenCalled();
    }));
  })

  describe('allShipSelected', () => {
    it('should dispatch prepare system board', inject([Store], (store: Store<BoardState>) => {
      // Arrange
      spyOn(store, 'dispatch');
      const board = new Board(1);

      // Act
      component.allShipSelected(true, board);

      // Assert
      expect(store.dispatch).toHaveBeenCalled();
    }));

    it('should open modal popup', inject([MatDialog], (modal: MatDialog) => {
      // Arrange
      spyOn(modal, 'open');
      component.currentPlayer = "System";
      const board = new Board(1);

      // Act
      component.allShipSelected(true, board);

      // Assert
      expect(modal.open).toHaveBeenCalled();
    }));
  })

  describe('onClick', () => {
    it('should open modal popup', inject([MatDialog], (modal: MatDialog) => {
      // Arrange
      spyOn(modal, 'open');

      // Act
      component.onClick();

      // Assert
      expect(modal.open).toHaveBeenCalled();
    }));
  })
});