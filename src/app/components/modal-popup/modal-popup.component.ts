import { TitleCasePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialogue } from '../../models/dialog.model';

@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.css']
})
export class ModalPopupComponent {  
  constructor(
    public dialogRef: MatDialogRef<ModalPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Dialogue,
    public titleCasePipe: TitleCasePipe) {}

  // get caption() {
  //   return this.data.caption;
  // }

  onCancelClicked(): void {
    this.data.isCancelClicked = true;
    this.dialogRef.close(this.data);
  }

  button1Clicked = () => {
    this.data.isButton1Clicked = true;
    this.dialogRef.close(this.data);
  } 
  
  button2Clicked = () => {
    this.data.isButton2Clicked = true;
    this.dialogRef.close(this.data);
  }
  
  // selectPlayer(player) {
  //   this.data.value = player === 1 ? 'single' : 'double';
  //   this.dialogRef.close(this.data);
  // }

  // onCancelClick() {
  //   this.data.value = 'cancelled';
  //   this.dialogRef.close(this.data);
  // }

  isButtonEnabled(): boolean {
    return (this.data && this.data.value && this.data.value.length >= 2) || 
           !this.data.isInputVisisble; // && this.data.type !== 'myName');
  }

  keyPress(event: any) {    
    var charCode = (event.which) ? event.which : event.keyCode;

    if (this.data.type==='myName' || this.data.type === 'profileUpdate') {
      if (charCode === 13 && this.isButtonEnabled()) {
        this.dialogRef.close(this.data);
      }
    } else {
      // initially Only Numbers 0-9 
      if (this.data && !this.data.value) {
        if ((charCode < 49 || charCode > 57)) {
          event.preventDefault();
          return false;
        } else {
          return true;
        }
      }

      // if (this.data && this.data.value && this.data.value.length === 1) {
      //   // allow only A to J and a to j
      //   if ((charCode >= 97 && charCode <= 106) || ((charCode >= 65 && charCode <= 74))) { 
      //     return true;
      //   } else {
      //     event.preventDefault();
      //     return false;
      //   }
      // }

      if (charCode === 13) {
        this.dialogRef.close(this.data);
      }

      if (this.data.value && this.data.value.length >= 3) {
        event.preventDefault();
        return false;
      }
    }
    return
  }
}