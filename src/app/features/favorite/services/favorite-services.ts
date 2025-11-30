import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { IDish } from '../../dishes-card/interfaces/Idish';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../core/environment/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class FavoriteServices {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  favoriteList: BehaviorSubject<{ data: IDish[]; meta: { total: number } }> = new BehaviorSubject<{
    data: IDish[];
    meta: { total: number };
  }>({ data: [], meta: { total: 0 } });
  init() {
    return this.getFavorite()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.favoriteList.next(res);
          console.log('favobs', this.favoriteList.value);
        },
      });
  }
  favoriteListAsObservable(): Observable<{ data: IDish[]; meta: { total: number } }> {
    return this.favoriteList.asObservable();
  }
  getFavorite(): Observable<{ data: IDish[]; meta: { total: number } }> {
    return this.http.get<{ data: IDish[]; meta: { total: number } }>(
      `${environment.endpoints.favorite.myFavorite}`
    );
  }
  toggleFavorite(dishId: number): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${environment.endpoints.favorite.toggleFavorite(dishId)}`, {})
      .pipe(
        tap(() => {
          const current = this.favoriteList.value.data;
          const updated = current.filter((d) => d.id !== dishId);
          this.favoriteList.next({
            data: updated,
            meta: { total: updated.length },
          });
        })
      );
  }
}
