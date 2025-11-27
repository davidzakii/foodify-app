import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../core/environment/environment';
import { Iprofile } from '../interfaces/iprofile';

@Injectable({
  providedIn: 'root',
})
export class Profile {
  private http = inject(HttpClient);
  getProfile(): Observable<Iprofile> {
    return this.http.get<Iprofile>(`${environment.endpoints.profile.getProfile}`);
  }
  updateProfile(
    full_name: string,
    email: string,
    birthday: string,
    address: string
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.endpoints.profile.updateProfile}`, {
      full_name,
      email,
      birthday,
      address,
    });
  }
}
