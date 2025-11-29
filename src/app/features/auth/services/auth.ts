import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../core/environment/environment';
import { BehaviorSubject, from, Observable, of, switchMap, tap } from 'rxjs';
import { IRegister } from '../interfaces/iregister';
import { IResetPassword } from '../reset-password/interfaces/ireset-password';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private saveTokens(token: string) {
    localStorage.setItem('token', token);
  }

  handleLoginResponse(res: { message: string; data: any }) {
    if (res.message && res.data) {
      this.saveTokens(res.data.access_token);
    }
  }

  register(
    body: IRegister
  ): Observable<
    { success: boolean; message: string; data: any } | { message: string; error: any }
  > {
    return this.http.post<
      { success: boolean; message: string; data: any } | { message: string; error: any }
    >(environment.endpoints.auth.register, body);
  }
  login(phone: string, password: string): Observable<any> {
    return this.http
      .post<any>(environment.endpoints.auth.login, { phone, password })
      .pipe(tap((res) => this.handleLoginResponse(res)));
  }
  forgotPassword(phone: string): Observable<any> {
    return this.http.post<any>(environment.endpoints.auth.forgotPassword, { phone });
  }

  resendOtp(phoneNumber: string): Observable<any> {
    return this.http.post<any>(environment.endpoints.auth.resendOtp, { phoneNumber });
  }
  verifyRegisterOtp(phone: string, otp: string): Observable<any> {
    return this.http.post<any>(environment.endpoints.auth.verifyRegisterOtp, { phone, otp });
  }
  resetPassword(body: IResetPassword): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(environment.endpoints.auth.resetPassword, body);
  }
  logout(): Observable<any> {
    const token = localStorage.getItem('token') || 'acb.ssj.sko';
    return this.http
      .post<any>(
        environment.endpoints.auth.logout,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .pipe(tap(() => this.clearTokens()));
  }
  clearTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('userDetails');
  }
}
