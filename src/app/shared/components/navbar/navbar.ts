import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Iprofile } from '../../../features/profile/interfaces/iprofile';
import { Profile } from '../../../features/profile/services/profile';
import { FormsModule } from '@angular/forms';
import { FavoriteServices } from '../../../features/favorite/services/favorite-services';
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, NgOptimizedImage],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private router = inject(Router);
  private authService = inject(AuthService);
  private profileService = inject(Profile);
  private favoritesService = inject(FavoriteServices);
  private destroyRes = inject(DestroyRef);
  user = signal<Iprofile | null>(null);
  isLoggedIn = signal<boolean>(false);
  cartCount = signal<number>(3);
  favoritesCount = signal<number>(5);
  searchQuery: string = '';

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    const loggedIn = localStorage.getItem('token') ? true : false;

    this.isLoggedIn.set(loggedIn);

    if (loggedIn) {
      this.profileService
        .getProfile()
        .pipe(takeUntilDestroyed(this.destroyRes))
        .subscribe((res) => {
          this.user.set(res);
        });
      this.favoritesService.init();
      this.favoritesService
        .favoriteListAsObservable()
        .pipe(takeUntilDestroyed(this.destroyRes))
        .subscribe((res) => {
          this.favoritesCount.set(res.meta.total);
        });
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      });
    }
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  onShare(): void {
    if (navigator.share) {
      navigator
        .share({
          title: 'Check this out!',
          text: 'Amazing content from MyApp',
          url: window.location.href,
        })
        .catch((error) => console.log('Error sharing:', error));
    } else {
      alert('Link copied to clipboard!');
    }
  }

  logout(): void {
    this.authService
      .logout()
      .pipe(
        tap(() => {
          takeUntilDestroyed(this.destroyRes);
        })
      )
      .subscribe(() => {
        this.isLoggedIn.set(false);
        this.user.set(null);
        this.router.navigate(['/']);
      });
  }
}
