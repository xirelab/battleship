import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.css']
})
export class ModalPopupComponent {

  // constructor(
  //   public dialogRef: MatDialogRef<ModalPopupComponent>,
  //   @Inject(MAT_DIALOG_DATA) public data: string) {}

  onNoClick(): void {
    // this.dialogRef.close();
  }

}