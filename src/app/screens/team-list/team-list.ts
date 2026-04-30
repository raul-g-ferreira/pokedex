import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CardSkeleton } from '../../components/skeletons/card-skeleton/card-skeleton';
import { TeamCard } from "../../components/team-card/team-card";
import { TeamService } from '../../services/team-service';
import { MatDialog } from '@angular/material/dialog';
import { TeamFormModal } from '../../components/team-form-modal/team-form-modal';
import { TeamCreateDTO } from '../../models/dtos/team-create-dto';
import { Team } from '../../models/team';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-teams',
  imports: [
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    NgxSkeletonLoaderModule,
    CardSkeleton,
    MatCheckboxModule,
    TeamCard,
    MatButtonModule
],
  templateUrl: './team-list.html',
  styleUrl: './team-list.scss',
})
export class TeamList implements OnInit {

  public isLoading = signal(false)
  public searchTerm = signal<string>('')

  public teams = signal<Team[]>([])

  public filteredTeams = computed(() => {
    const term = this.searchTerm().toLowerCase()

    return this.teams().filter(t => {
      const matchName = t.name.toLowerCase().includes(term)

      return matchName
    })
  })

  constructor (
    private teamService: TeamService,
    private dialog: MatDialog,
  ) {}


  async ngOnInit() {
    await this.loadTeams()
  }


  async loadTeams() {
    this.isLoading.set(true)
    try {
      const teams = await this.teamService.getTeams()
      teams.sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1
        if (!a.isFavorite && b.isFavorite) return 1
        return 0
      })
      this.teams.set(teams)

    } finally {
      this.isLoading.set(false)
    }
  }

  async createTeam() {
    const dialogRef = this.dialog.open(TeamFormModal, {
      width: '400px',
    })

    dialogRef.afterClosed().subscribe(async (result: TeamCreateDTO) => {
      if (result){
        this.isLoading.set(true)
        await this.teamService.createTeam(result)
        await this.loadTeams()
        this.isLoading.set(false)
      }
    })
  }

  clearSearchTerm() {
    this.searchTerm.set('')
  }
}
