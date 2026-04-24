import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-detail-skeleton',
  imports: [
    MatIconModule,
    NgxSkeletonLoaderModule
  ],
  templateUrl: './detail-skeleton.html',
  styleUrl: './detail-skeleton.css',
})
export class DetailSkeleton {}
