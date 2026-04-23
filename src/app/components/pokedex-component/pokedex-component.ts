import { TitleCasePipe } from '@angular/common';
import { Component, computed, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { PokemonBasic } from '../../models/pokemon-basic';
import { PokemonService } from '../../services/pokemon-service';
import { PokemonCard } from '../pokemon-card/pokemon-card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CardSkeleton } from '../skeletons/card-skeleton/card-skeleton';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-pokedex-component',
  imports: [
    PokemonCard,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    TitleCasePipe,
    NgxSkeletonLoaderModule,
    CardSkeleton,
    MatCheckboxModule
  ],
  templateUrl: './pokedex-component.html',
  styleUrl: './pokedex-component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PokedexComponent implements OnInit {
  public allPokemons = signal<PokemonBasic[]>([]);
  public isLoading = signal<boolean>(true);

  public searchTerm = signal<string>('');
  public selectedType = signal<string[]>([]);
  public availableTypes = signal<string[]>(['normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']);
  public showOnlyFavorites = signal<boolean>(false);

  public pageSize = signal<number>(12);
  public currentPage = signal<number>(0);

  public filteredPokemons = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const type = this.selectedType();
    const showFavs = this.showOnlyFavorites();

    this.allPokemons().forEach(pokemon => {
      pokemon.isFavorite = JSON.parse(localStorage.getItem(`pokemon_${pokemon.id}`) || 'false').isFavorite;
    })

    return this.allPokemons().filter(pokemon => {
      const matchName = pokemon.name.toLowerCase().includes(term);

      const matchType = type.length > 0
        ? type.every((selectedType: string) =>
          (pokemon as any).types?.some((pkmType: any) => pkmType.type.name === selectedType)
        )
        : true;
      return matchName && matchType && (!showFavs || (pokemon as any).isFavorite);
    });

  });

  public pagedPokemons = computed(() => {
    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredPokemons().slice(start, end);
  });

  constructor(
    private pokemonService: PokemonService
  ) { }

  ngOnInit(): void {
    this.fetchPokemons();
  }

  private fetchPokemons(): void {
    this.pokemonService.getFirstGenerationPokemons().subscribe({
      next: (data) => {
        this.allPokemons.update(d => d = data)
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar na api', err);
        this.isLoading.set(false);
      }
    });
  }

  public onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  public onFilterChange(): void {
    this.currentPage.set(0);
  }
}
