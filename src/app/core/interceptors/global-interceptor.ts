import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { environment } from '../environment/environment';

export const globalInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);

  spinner.show();

  const token = localStorage.getItem('token');
  const authReq = token
    ? req.clone({
        url: `${environment.apiBaseUrl}${req.url}`,
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req.clone({ url: `${environment.apiBaseUrl}${req.url}` });

  return next(authReq).pipe(finalize(() => spinner.hide()));
};
