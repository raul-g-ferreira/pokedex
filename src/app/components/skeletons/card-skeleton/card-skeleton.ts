import { Component, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-card-skeleton',
  imports: [MatCardModule, NgxSkeletonLoaderModule],
  templateUrl: './card-skeleton.html',
  styleUrl: './card-skeleton.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CardSkeleton {}
