import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDish } from './interfaces/Idish';


@Component({
  selector: 'app-dishes-card',
  standalone: true,
  imports: [],
  templateUrl: './dishes-card.html',
  styleUrl: './dishes-card.scss',
})
export class DishesCard {
  @Input() dish!: IDish;
  @Input() currency: string = 'EGP';
  @Output() addToCart = new EventEmitter<IDish>();
  @Output() toggleFavorite = new EventEmitter<IDish>();

  isFavorite: boolean = false;

  get stars(): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, index) => index < Math.floor(this.dish.rating));
  }

  onAddToCart(): void {
    this.addToCart.emit(this.dish);
  }

  onToggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    this.toggleFavorite.emit(this.dish);
  }
}
