import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDish } from '../../dishes-card/interfaces/Idish';
import { Observable } from 'rxjs';
import { environment } from '../../../core/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class FavoriteServices {
  private http = inject(HttpClient);
  getFavorite(): Observable<{ data: IDish[]; meta: { total: number } }> {
    return this.http.get<{ data: IDish[]; meta: { total: number } }>(
      `${environment.endpoints.favorite.myFavorite}`
    );
  }
  addFavorite(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${environment.endpoints.favorite.myFavorite}`);
  }
}
