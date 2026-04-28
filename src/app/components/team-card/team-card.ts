import { Component, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, of, switchMap } from 'rxjs';
import { Team } from '../../models/team';
import { PokemonService } from '../../services/pokemon-service';

@Component({
  selector: 'app-team-card',
  imports: [],
  templateUrl: './team-card.html',
  styleUrl: './team-card.scss',
})
export class TeamCard {
  readonly team = input.required<Team>()

  constructor(
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
}
