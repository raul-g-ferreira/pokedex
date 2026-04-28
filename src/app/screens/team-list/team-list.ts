import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PokemonCard } from '../../components/pokemon-card/pokemon-card';
import { CardSkeleton } from '../../components/skeletons/card-skeleton/card-skeleton';
import { TeamService } from '../../services/team-service';
import { TeamCard } from "../../components/team-card/team-card";

@Component({
  selector: 'app-teams',
  imports: [
    PokemonCard,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    NgxSkeletonLoaderModule,
    CardSkeleton,
    MatCheckboxModule,
    TeamCard
],
  templateUrl: './team-list.html',
  styleUrl: './team-list.scss',
})
export class TeamList implements OnInit {
  teams = signal<any[]>([]);

  public isLoading = signal(false);
  public searchTerm = signal<string>('');

  constructor (
    private teamService: TeamService
  ) {}


  async ngOnInit() {
    await this.loadTeams()
  }


  async loadTeams() {
    this.isLoading.set(true)
    try {
      this.teams.set(await this.teamService.getTeams())

    } finally {
      this.isLoading.set(false)
    }
  }

  async createTeam() {
    const teamName = prompt("Type the team name:")
    if (teamName && teamName.trim().length > 0) {
      this.isLoading.set(true)
      await this.teamService.createTeam(teamName)
      await this.loadTeams()
    }
  }
}
