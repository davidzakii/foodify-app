import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDish } from '../dishes-card/interfaces/Idish';
import { DishesServices } from '../dishes-card/services/dishes-services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DishesCard } from '../dishes-card/dishes-card';

@Component({
  selector: 'app-dishes-according-category',
  standalone: true,
  imports: [DishesCard],
  templateUrl: './dishes-according-category.html',
  styleUrl: './dishes-according-category.scss',
})
export class DishesAccordingCategory implements OnInit {
  private activatedroute = inject(ActivatedRoute);
  private dishesService = inject(DishesServices);
  private destroyRef = inject(DestroyRef);
  dishes = signal<IDish[]>([]);
  catId = signal<number>(0);
  categoryName = signal<string>('');
  ngOnInit(): void {
    const param = this.activatedroute.snapshot.paramMap.get('catId');
    if (param) this.catId.set(Number(param));
    
    this.dishesService
      .getDishes(this.catId(), '')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.categoryName.set(res.data[0].category)
        this.dishes.set(res.data);
      });
  }
}
