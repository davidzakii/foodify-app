import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const msg =
          err.error?.message ||
          err.error?.errors?.[0] ||
          `Error ${err.status || ''}: ${err.statusText || 'Unknown'}`;

        toast.error(msg);
      } else {
        toast.error('Something went wrong');
      }

      return throwError(() => err);
    })
  );
};
