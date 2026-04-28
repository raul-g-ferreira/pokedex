import { Component, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, of, switchMap } from 'rxjs';
import { Team } from '../../models/team';
import { PokemonService } from '../../services/pokemon-service';
import { MatIconModule } from '@angular/material/icon';
import { TeamService } from '../../services/team-service';

@Component({
  selector: 'app-team-card',
  imports: [MatIconModule],
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
    private pokemonService: PokemonService
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
    const confirmDelete = confirm(`Are you sure you want to delete the team "${this.team().name}"? This action cannot be undone.`);
    if (confirmDelete) {
      await this.teamService.removeTeam(teamId);
      this.onTeamDeleted.emit()
    }
  }

  toggleEditMode() {
    this.isEditing.update(valor => !valor)
  }

  removePokemon(pokemonId:string) {
    this.teamService.removePokemonFromTeam(pokemonId, this.team().id)
    console.log(this.team())
    this.onTeamUpdated.emit()
  }
}
