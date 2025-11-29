import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password-correctly',
  imports: [],
  templateUrl: './change-password-correctly.html',
  styleUrl: './change-password-correctly.scss',
})
export class ChangePasswordCorrectly {
  private router = inject(Router);
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
