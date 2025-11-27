import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ICategory } from './interfaces/icategory';
import { Categories as CategoryService } from '../categories/services/categories';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  private categoriesService = inject(CategoryService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  categories = signal<ICategory[]>([]);
  ngOnInit(): void {
    this.categoriesService
      .getCategory('')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.categories.set(res.data);
      });
  }
}
