import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../core/environment/environment';
import { IDish } from '../interfaces/Idish';

@Injectable({
  providedIn: 'root',
})
export class DishesServices {
  private http = inject(HttpClient);
  getDishes(categoryId: number, search: string): Observable<{ data: IDish[] }> {
    return this.http.get<{ data: IDish[] }>(
      `${environment.endpoints.dishes.getDishes(categoryId)}${search}`
    );
  }
  getRecommended(): Observable<{ data: IDish[] }> {
    return this.http.get<{ data: IDish[] }>(`${environment.endpoints.dishes.recommended}`);
  }
}
