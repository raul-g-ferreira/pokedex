import { ChangeDetectorRef, Component, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, of, switchMap } from 'rxjs';
import { Team } from '../../models/team';
import { PokemonService } from '../../services/pokemon-service';
import { TeamService } from '../../services/team-service';
import { TeamStats } from '../team-stats/team-stats';
import { ConfirmModal } from '../confirm-modal/confirm-modal';

@Component({
  selector: 'app-team-card',
  imports: [
    MatIconModule,
  ],
  templateUrl: './team-card.html',
  styleUrl: './team-card.scss',
})
export class TeamCard {
  readonly team = input.required<Team>()

  onTeamDeleted = output<void>()
  onTeamUpdated = output<void>()

  isEditing = signal<boolean>(false)

  constructor(
    private teamService: TeamService,
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  private team$ = toObservable(this.team);


  pokemons = toSignal(
    this.team$.pipe(
      switchMap(currentTeam => {
        if (!currentTeam.pokemonIds || currentTeam.pokemonIds.length === 0) {
          return of([]);
        }

        const requests = currentTeam.pokemonIds.map(pkmId =>
          this.pokemonService.getPokemonDetails(pkmId)
        );

        return forkJoin(requests);
      })
    ),
    { initialValue: [] }
  );

  async deleteTeam(teamId: string) {
    const dialogRef = this.dialog.open(ConfirmModal, {
      height: '150px',
      data: 'Confirm to delete the team'
    })

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        await this.teamService.removeTeam(teamId);
        this.onTeamDeleted.emit()
      }
    })
  }

  toggleEditMode() {
    this.isEditing.update(valor => !valor)
  }

  async removePokemon(pokemonId:string) {
    await this.teamService.removePokemonFromTeam(pokemonId, this.team().id)
    this.onTeamUpdated.emit()
    this.cdr.detectChanges()
  }

  showStats(team: Team) {
    this.dialog.open(TeamStats, {
      width: '400px',
      data: team
    })
  }

  toggleFavorite() {
    this.teamService.toggleFavorite(this.team().id)
    this.team().isFavorite = !this.team().isFavorite
  }
}
