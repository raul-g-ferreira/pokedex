import { Component, OnInit, signal } from '@angular/core';
import { PokemonService } from '../../services/pokemon-service';
import { PokemonBasic } from '../../model/pokemon-basic';
import { PokemonCard } from '../pokemon-card/pokemon-card';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pokedex-component',
  imports: [PokemonCard, MatProgressSpinnerModule],
  templateUrl: './pokedex-component.html',
  styleUrl: './pokedex-component.scss',
})
export class PokedexComponent implements OnInit{
  public pokemons = signal<PokemonBasic[]>([]);
  // public pokemons: PokemonBasic[] = []
  public isLoading: boolean = true;

  constructor(
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.fetchPokemons();
  }

  private fetchPokemons(): void {
    this.pokemonService.getFirstGenerationPokemons().subscribe({
      next: (data) => {
        this.pokemons.update(d => d = data)
        // this.pokemons = data
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar na api', err);
        this.isLoading = false;
      }
    });
  }
}
