import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ICategory } from './interfaces/icategory';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoriesServices } from './services/categories';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  private categoriesService = inject(CategoriesServices);
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

  dishesCat(catId: number) {
    this.router.navigate(['/dishes', catId]);
  }
}
