import { Routes } from '@angular/router';
import { PokedexComponent } from './screens/pokedex-component/pokedex-component';
import { TeamList } from './screens/team-list/team-list';

export const routes: Routes = [
  {
    path: '',
    component: PokedexComponent
  },
  {
    path: 'pokedex',
    component: PokedexComponent
  },
  {
    path: 'team-list',
    component: TeamList
  },
];
