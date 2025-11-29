import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { IResetPassword } from './interfaces/ireset-password';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { toast } from 'ngx-sonner';
@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private activatedRoute = inject(ActivatedRoute);
  resetPasswordForm!: FormGroup;
  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  phone = signal<string>('');
  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.resetPasswordForm = this.fb.group(
      {
        otp1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
        otp2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
        otp3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
        otp4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('password_confirmation');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
      return null;
    }
  }

  // Getters for form controls

  get otp() {
    const { otp1, otp2, otp3, otp4 } = this.resetPasswordForm.value;
    return `${otp1}${otp2}${otp3}${otp4}`;
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  get passwordConfirmation() {
    return this.resetPasswordForm.get('password_confirmation');
  }

  // Toggle password visibility
  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.showPassword.set(!this.showPassword());
    } else {
      this.showConfirmPassword.set(!this.showConfirmPassword());
    }
  }

  // Check if field has specific error
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.resetPasswordForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.touched || this.isSubmitted()));
  }

  // Get error message for field
  getErrorMessage(fieldName: string): string {
    const field = this.resetPasswordForm.get(fieldName);

    if (!field || (!field.touched && !this.isSubmitted())) {
      return '';
    }

    if (field.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    switch (fieldName) {
      case 'full_name':
        if (field.hasError('minlength')) {
          return 'Full name must be at least 3 characters';
        }
        if (field.hasError('whitespace')) {
          return 'Full name cannot be empty or only spaces';
        }
        break;

      case 'phone':
        if (field.hasError('pattern') || field.hasError('invalidPrefix')) {
          return 'Phone must start with 010, 011, 012, or 015';
        }
        if (field.hasError('invalidLength')) {
          return 'Phone number must be 11 digits';
        }
        break;

      case 'password':
        if (field.hasError('minlength')) {
          return 'Password must be at least 6 characters';
        }
        break;

      case 'password_confirmation':
        if (field.hasError('passwordMismatch')) {
          return 'Passwords do not match';
        }
        break;
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      full_name: 'Full name',
      phone: 'Phone number',
      password: 'Password',
      password_confirmation: 'Confirm password',
    };
    return labels[fieldName] || fieldName;
  }

  onSubmit(): void {
    this.isSubmitted.set(true);

    if (this.resetPasswordForm.valid) {
      this.isLoading.set(true);

      const resetPassword: IResetPassword = {
        otp: this.otp,
        password: this.password?.value,
        password_confirmation: this.passwordConfirmation?.value,
        phone: this.activatedRoute.snapshot.paramMap.get('phoneNumber') || '',
      };
      this.authService
        .resetPassword(resetPassword)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.isLoading.set(false);
            this.isSubmitted.set(false);
            this.router.navigate(['/reset-password-success']);

            toast.success(response.message);
            this.resetPasswordForm.reset();
          },
          error: (error) => {
            this.isLoading.set(false);
            this.isSubmitted.set(false);
          },
        });
    } else {
      Object.keys(this.resetPasswordForm.controls).forEach((key) => {
        this.resetPasswordForm.get(key)?.markAsTouched();
      });
    }
  }
  moveToNext(event: any, next: string) {
    if (event.target.value.length === 1) {
      const nextField = this.resetPasswordForm.get(next);
      const inputEl = document.querySelector(
        `input[formControlName='${next}']`
      ) as HTMLInputElement;
      inputEl?.focus();
    }
  }

  moveToPrev(event: any, prev: string) {
    if (!event.target.value) {
      const prevInput = document.querySelector(
        `input[formControlName='${prev}']`
      ) as HTMLInputElement;
      prevInput?.focus();
    }
  }
}
