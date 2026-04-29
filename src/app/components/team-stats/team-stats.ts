import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Team } from '../../models/team';

@Component({
  selector: 'app-team-stats',
  imports: [],
  templateUrl: './team-stats.html',
  styleUrl: './team-stats.scss',
})
export class TeamStats implements OnInit {


  public animateBars = signal<boolean>(false);

  constructor (
    @Inject (MAT_DIALOG_DATA) public data: Team
  ) {}

  ngOnInit () {
    setTimeout(() => {
      this.animateBars.set(true)
    }, 50)
  }
}
