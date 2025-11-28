import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { toast } from 'ngx-sonner';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;
  showPassword = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      phone: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10,15}$/), Validators.minLength(10)],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });
  }

  get phone() {
    return this.loginForm.get('phone');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Allow only numbers in phone input
  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.phone?.setValue(input.value);
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit(): void {
    this.isSubmitted.set(true);
    const { phone, password } = this.loginForm.value;
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.authService
        .login(phone, password)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            if (this.loginForm.value.rememberMe) {
              localStorage.setItem('rememberMe', 'true');
            }
            if (res.access_token) {
              localStorage.setItem('token', res.access_token);
            }
            this.isLoading.set(false);
            this.isSubmitted.set(false);
            this.loginForm.reset();
            toast.success(res.message);
            this.router.navigate(['/home']);
          },
          error: () => {
            this.isLoading.set(false);
            this.isSubmitted.set(false);
          },
        });
    } else {
      this.isLoading.set(false);
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.touched || this.isSubmitted()));
  }
}
