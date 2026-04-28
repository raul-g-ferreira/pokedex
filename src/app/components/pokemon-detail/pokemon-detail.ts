import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { FullPokemon } from '../../models/full-pokemon';
import { PokemonBasic } from '../../models/pokemon-basic';
import { PokemonService } from '../../services/pokemon-service';
import { TeamService } from '../../services/team-service';
import { DetailSkeleton } from '../skeletons/detail-skeleton/detail-skeleton';
import { Team } from '../../models/team';

@Component({
  selector: 'app-pokemon-detail',
  imports: [
    MatDialogModule,
    TitleCasePipe,
    UpperCasePipe,
    MatIconModule,
    DetailSkeleton,
    MatFormField,
    MatLabel,
    MatSelectModule,
    MatOption,
    FormsModule
  ],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.scss',
})
export class PokemonDetail implements OnInit {
  public pokemonFull = signal<FullPokemon>({
    id: '',
    name: '',
    imageUrl: '',
    gifUrl: '',
    types: [],
    stats: [],
    description: '',
    isFavorite: false
  });
  public isLoading: boolean = true;

  selectedTeams = signal<string[]>([])
  teams: Team[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PokemonBasic,
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef,
    private teamService: TeamService
  ) {}

  async ngOnInit() {
    this.pokemonService.getPokemonDetails(this.data.id!).subscribe(res => {
      this.pokemonFull.set(res)
      this.isLoading = false

      this.cdr.detectChanges()

    })
    this.teams = await this.teamService.getTeams()
    const currentTeams = await this.teamService.getTeamsByPokemon(this.data.id)
    this.selectedTeams.set(currentTeams)
  }

  adjustStatsName(statName: string) {
    const names: any = {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'SP Attack',
      'special-defense': 'SP Defense',
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

  async onTeamChange(event: any) {
    const newSelection = event.value
    await this.teamService.updatePokemonInTeams(this.data.id, newSelection)
    this.selectedTeams.set(newSelection)
  }
}
