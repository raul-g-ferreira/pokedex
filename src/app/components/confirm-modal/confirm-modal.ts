import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-modal',
  imports: [
    MatDialogModule,
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss',
})
export class ConfirmModal {
  readonly message = inject(MAT_DIALOG_DATA)

  constructor(
    public dialogRef: MatDialogRef<boolean>
  ) {}

  onCancel() {
    this.dialogRef.close(false)
  }

  onConfirm() {
    this.dialogRef.close(true)
  }
}
