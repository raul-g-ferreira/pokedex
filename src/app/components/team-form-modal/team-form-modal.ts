import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TeamCreateDTO } from './../../models/dtos/team-create-dto';
import { Component, inject, model } from '@angular/core';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-team-form-modal',
  imports: [
    MatDialogModule,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './team-form-modal.html',
  styleUrl: './team-form-modal.scss',
})
export class TeamFormModal {
  readonly teamInfo = model<TeamCreateDTO>({
    name: '',
    description: ''
  })

  constructor(
    public dialogRef: MatDialogRef<TeamFormModal>
  ) {}

  onCancel() {
    this.dialogRef.close()
  }

  onSubmit() {
    this.dialogRef.close(this.teamInfo())
  }
}
