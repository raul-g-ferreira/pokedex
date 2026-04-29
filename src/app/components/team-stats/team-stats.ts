import { Component, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Team } from '../../models/team';

@Component({
  selector: 'app-team-stats',
  imports: [],
  templateUrl: './team-stats.html',
  styleUrl: './team-stats.scss',
})
export class TeamStats {

  public isLoading = signal<boolean>(true);

  constructor (
    @Inject (MAT_DIALOG_DATA) public data: Team
  ) {}


}
