import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CategoriesServices } from '../categories/services/categories';
import { ICategory } from '../categories/interfaces/icategory';
import { Router } from '@angular/router';
import { IDish } from '../dishes-card/interfaces/Idish';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DishesCard } from '../dishes-card/dishes-card';
import { DishesServices } from '../dishes-card/services/dishes-services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DishesCard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private categoriesService = inject(CategoriesServices);
  private dishesService = inject(DishesServices);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  categories = signal<ICategory[]>([]);
  recommended = signal<IDish[]>([]);
  ngOnInit(): void {
    this.categoriesService
      .getCategory('')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.categories.set(res.data);
      });
    this.dishesService
      .getRecommended()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.recommended.set(res.data);
        console.log(this.recommended());
      });
  }
  dishes(catId: number) {
    this.router.navigate(['/dishes', catId]);
  }
}
