import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokedexComponent } from './components/pokedex-component/pokedex-component';
import { Header } from './template/header/header';
import { Content } from './template/content/content';

@Component({
  selector: 'app-root',
  imports: [Content, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pokedex');
}
