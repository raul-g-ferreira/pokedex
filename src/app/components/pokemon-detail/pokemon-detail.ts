import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PokemonBasic } from '../../models/pokemon-basic';
import { PokemonService } from '../../services/pokemon-service';
import { DetailSkeleton } from '../skeletons/detail-skeleton/detail-skeleton';

@Component({
  selector: 'app-pokemon-detail',
  imports: [
    MatDialogModule,
    TitleCasePipe,
    UpperCasePipe,
    MatIconModule,
    DetailSkeleton
  ],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.scss',
})
export class PokemonDetail implements OnInit {
  public pokemonFull = signal<any>(null);
  public isLoading: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PokemonBasic,
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.pokemonService.getPokemonDetails(this.data.id!).subscribe(res => {
      this.pokemonFull.set(res)
      this.isLoading = false

      this.cdr.detectChanges()
    })
  }

  adjustStatsName(statName: string) {
    const names: any = {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'SP Attack',
      'special-defense': 'SP. Defense',
      'speed': 'Speed'
    };
    return names[statName] || statName
  }

  toggleFavorite(id: string | undefined) {
    if (!id) {
      console.error('Internal error')
    }
    this.pokemonService.toggleFavorite(id!);

    this.pokemonFull.update(pokemon => {
        return {
          ...pokemon,
          isFavorite: !pokemon.isFavorite
        }
    })
  }
}
