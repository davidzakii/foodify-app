import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesServices } from '../categories/services/categories';
import { ICategory } from '../categories/interfaces/icategory';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DishesServices } from '../dishes-card/services/dishes-services';
import { IDish } from '../dishes-card/interfaces/Idish';
import { forkJoin, map, switchMap } from 'rxjs';
import { DishesCard } from '../dishes-card/dishes-card';

@Component({
  selector: 'app-dishes-filter',
  imports: [DishesCard],
  templateUrl: './dishes-filter.html',
  styleUrl: './dishes-filter.scss',
})
export class DishesFilter implements OnInit {
  private destroyRef = inject(DestroyRef);
  private activatedRoute = inject(ActivatedRoute);
  private categoryService = inject(CategoriesServices);
  private dishesServices = inject(DishesServices);
  query = signal<string>('');
  categories = signal<ICategory[]>([]);
  dishes = signal<IDish[]>([]);
  ngOnInit(): void {
    this.activatedRoute.queryParamMap
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((queryParams) => {
          const q = queryParams.get('q') || '';
          this.query.set(q);
          return this.categoryService.getCategory(q).pipe(takeUntilDestroyed(this.destroyRef));
        }),
        switchMap((categoryRes) => {
          this.categories.set(categoryRes.data);
          const categoryIds = categoryRes.data.map((cat) => cat.id);

          const dishObservables = categoryIds.map((catId) =>
            this.dishesServices
              .getDishes(catId, this.query())
              .pipe(takeUntilDestroyed(this.destroyRef))
          );
          return forkJoin(dishObservables).pipe(
            takeUntilDestroyed(this.destroyRef),
            map((responses) => responses.flatMap((res) => res.data))
          );
        })
      )
      .subscribe({
        next: (allDishes) => {
          this.dishes.set(allDishes);
          console.log('All dishes loaded:', this.dishes()); // Will have all data now
        },
      });
  }
}
