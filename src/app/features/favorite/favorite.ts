import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FavoriteServices } from './services/favorite-services';
import { IDish } from '../dishes-card/interfaces/Idish';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
@Component({
  selector: 'app-favorite',
  imports: [],
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
      .getFavorite()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.favorites.set(res.data);
      });
  }

  goToCategory() {
    this.router.navigate(['/categories']);
  }
}
