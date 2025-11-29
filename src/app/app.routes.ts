import { Routes } from '@angular/router';
import { afterLoginGuard } from './core/guards/after-login-guard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout').then((m) => m.Layout),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/categories/categories').then((m) => m.Categories),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./features/dishes-filter/dishes-filter').then((m) => m.DishesFilter),
      },
      {
        path: 'favorites',
        loadComponent: () => import('./features/favorite/favorite').then((m) => m.Favorite),
      },
      {
        path: 'dishes/:catId',
        loadComponent: () =>
          import('./features/dishes-according-category/dishes-according-category').then(
            (m) => m.DishesAccordingCategory
          ),
      },
    ],
  },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    canActivate: [afterLoginGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
    canActivate: [afterLoginGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password').then((m) => m.ForgotPassword),
    canActivate: [afterLoginGuard],
  },
  {
    path: 'verify-otp/:phoneNumber',
    loadComponent: () => import('./features/auth/verify-otp/verify-otp').then((m) => m.VerifyOtp),
    canActivate: [afterLoginGuard],
  },
  {
    path: 'reset-password/:phoneNumber',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password').then((m) => m.ResetPassword),
    canActivate: [afterLoginGuard],
  },
  {
    path: 'reset-password-success',
    loadComponent: () =>
      import('./features/auth/change-password-correctly/change-password-correctly').then((m) => m.ChangePasswordCorrectly),
    canActivate: [afterLoginGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
];
