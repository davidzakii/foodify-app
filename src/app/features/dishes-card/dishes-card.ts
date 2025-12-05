import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { IDish } from './interfaces/Idish';
import { FavoriteServices } from '../favorite/services/favorite-services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { toast } from 'ngx-sonner';
import { NgOptimizedImage } from "@angular/common";
@Component({
  selector: 'app-dishes-card',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './dishes-card.html',
  styleUrl: './dishes-card.scss',
})
export class DishesCard implements OnInit {
  @Input() dish!: IDish;
  @Input() currency: string = 'EGP';
  private favoriteService = inject(FavoriteServices);
  private destroyRef = inject(DestroyRef);
  ngOnInit(): void {
    this.getFavoriteStatus();
  }
  isFavorite = signal<boolean>(false);

  get stars(): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, index) => index < Math.floor(this.dish.rating));
  }

  onAddToCart(): void {}

  getFavoriteStatus(): void {
    this.favoriteService.init();
    this.favoriteService
      .favoriteListAsObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.isFavorite.set(res.data.some((favDish) => favDish.id === this.dish.id));
      });
  }
  onToggleFavorite(): void {
    this.favoriteService
      .toggleFavorite(this.dish.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.getFavoriteStatus();
          toast.success(res.message);
        },
      });
  }
}
