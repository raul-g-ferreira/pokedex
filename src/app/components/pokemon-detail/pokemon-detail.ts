import { ChangeDetectorRef, Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PokemonBasic } from '../../model/pokemon-basic';
import { PokemonService } from '../../services/pokemon-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail',
  imports: [MatDialogModule,
    MatProgressSpinner,
    TitleCasePipe,
    UpperCasePipe,
  ],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.scss',
})
export class PokemonDetail implements OnInit {
  // public pokemonFull: any;
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

}
