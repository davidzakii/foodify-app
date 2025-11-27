import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../core/environment/environment';
import { ICategory } from '../interfaces/icategory';

@Injectable({
  providedIn: 'root',
})
export class Categories {
  private http = inject(HttpClient);
  getCategory(search: string): Observable<{ data: ICategory[] }> {
    return this.http.get<{ data: ICategory[] }>(
      `${environment.endpoints.categories.getCategories}${search}`
    );
  }
}
