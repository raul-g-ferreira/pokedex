import { Component } from '@angular/core';
import { PokedexComponent } from '../../components/pokedex-component/pokedex-component';

@Component({
  selector: 'app-content',
  imports: [PokedexComponent],
  templateUrl: './content.html',
  styleUrl: './content.css',
})
export class Content {}
