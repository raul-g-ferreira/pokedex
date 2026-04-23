import { Component, input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { PokemonBasic } from '../../models/pokemon-basic';
import { TitleCasePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PokemonDetail } from '../pokemon-detail/pokemon-detail';

@Component({
  selector: 'app-pokemon-card',
  imports: [MatCardModule, TitleCasePipe],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss',
})
export class PokemonCard {
  readonly pokemon = input.required<PokemonBasic>();

  constructor(
    private dialog: MatDialog
  ) {}

  showDetails(pkm: PokemonBasic) {
    this.dialog.open(PokemonDetail, {
      width: '600px',
      data: pkm
    })
  }
}
