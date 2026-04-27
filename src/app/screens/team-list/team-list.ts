import { Component, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PokemonCard } from '../../components/pokemon-card/pokemon-card';
import { CardSkeleton } from '../../components/skeletons/card-skeleton/card-skeleton';

@Component({
  selector: 'app-teams',
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
  templateUrl: './team-list.html',
  styleUrl: './team-list.scss',
})
export class TeamList {
  teams = signal<any[]>([]);

  public isLoading = signal(false);
  public searchTerm = signal<string>('');


  createTeam() {

  }
}
