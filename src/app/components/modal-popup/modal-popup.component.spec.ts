import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ModalPopupComponent } from './modal-popup.component';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TitleCasePipe } from '@angular/common';

describe('ModalPopupComponent', () => {
  let component: ModalPopupComponent;
  let fixture: ComponentFixture<ModalPopupComponent>;

  beforeAll((done) => (async () => {
    TestBed.configureTestingModule({
      declarations: [ ModalPopupComponent ],
      imports: [ MatDialogModule ],
      providers: [
        MatDialog,
        TitleCasePipe,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    await TestBed.compileComponents();
  })().then(done).catch(done.fail));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('caption', () => {
    it('should return caption directly', () => {
      // Arrange
      component.data = {
        isInputVisisble: true,
        caption: 'caption',
        value: 'value'
      };

      // Act
      const response = component.caption;

      // Assert
      expect(response).toBe('caption');
    });  

    it('should return caption + value', () => {
      // Arrange
      component.data = {
        isInputVisisble: false,
        caption: 'caption',
        value: 'value'
      };

      // Act
      const response = component.caption;

      // Assert
      expect(response).toBe('caption value');
    });  
  });

  describe('onNoClick', () => {
    it('should close modal', inject([MatDialogRef], (dialogRef: MatDialogRef<ModalPopupComponent>) => {
      // Arrange
      spyOn(dialogRef, 'close');

      // Act
      component.onNoClick();

      // Assert
      expect(dialogRef.close).toHaveBeenCalled();
    }));
  });

  describe('isButtonEnabled', () => {
    it('should return isButtonEnabled true', () => {
      // Arrange
      component.data = {
        isInputVisisble: true,
        caption: 'caption',
        value: '12'
      };

      // Act
      const response = component.isButtonEnabled();

      // Assert
      expect(response).toBeTruthy();
    });  

    it('should return isButtonEnabled false', () => {
      // Arrange
      component.data = {
        isInputVisisble: true,
        caption: 'caption',
        value: '1'
      };

      // Act
      const response = component.isButtonEnabled();

      // Assert
      expect(response).toBeFalsy();
    });  
  });

  describe('keyPress', () => {
    it('should close modal', inject([MatDialogRef], (dialogRef: MatDialogRef<ModalPopupComponent>) => {
      // Arrange
      spyOn(dialogRef, 'close');
      component.data = {
        isInputVisisble: true,
        caption: 'caption',
        value: '1D'
      };
      const event = {
        keyCode: 13
      };

      // Act
      component.keyPress(event);

      // Assert
      expect(dialogRef.close).toHaveBeenCalled();
    }));

    it('should return true', inject([MatDialogRef], (dialogRef: MatDialogRef<ModalPopupComponent>) => {
      // Arrange
      spyOn(dialogRef, 'close');
      component.data = {
        isInputVisisble: true,
        caption: 'caption',
        value: ''
      };
      const event = {
        keyCode: 50
      };

      // Act
      const response = component.keyPress(event);

      // Assert
      expect(response).toBeTruthy();
      expect(dialogRef.close).not.toHaveBeenCalled();
    }));

    it('should return true', inject([MatDialogRef], (dialogRef: MatDialogRef<ModalPopupComponent>) => {
      // Arrange
      spyOn(dialogRef, 'close');
      component.data = {
        isInputVisisble: true,
        caption: 'caption',
        value: ''
      };
      const event = {
        keyCode: 45
      };

      // Act
      const response = component.keyPress(event);

      // Assert
      expect(response).toBeFalsy();
      expect(dialogRef.close).not.toHaveBeenCalled();
    }));
  });
});