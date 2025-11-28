import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const afterLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  let authToken: string | null = null;

  if (isPlatformBrowser(platformId)) {
    authToken = localStorage.getItem('token');
  }

  if (authToken) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
