import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FavoriteServices } from './services/favorite-services';
import { IDish } from '../dishes-card/interfaces/Idish';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DishesCard } from '../dishes-card/dishes-card';
import { NgOptimizedImage } from '@angular/common';
@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [DishesCard, NgOptimizedImage],
  templateUrl: './favorite.html',
  styleUrl: './favorite.scss',
})
export class Favorite implements OnInit {
  private favoriteService = inject(FavoriteServices);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  favorites = signal<IDish[]>([]);
  ngOnInit(): void {
    this.favoriteService
      .favoriteListAsObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        queueMicrotask(() => {
          this.favorites.set(res.data);
        });
      });
    this.favoriteService.init();
  }

  goToCategory() {
    this.router.navigate(['/categories']);
  }
}
