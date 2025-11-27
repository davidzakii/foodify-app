import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { toast } from 'ngx-sonner';
import { IRegister } from '../interfaces/iregister';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  registerForm!: FormGroup;
  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group(
      {
        full_name: ['', [Validators.required, Validators.minLength(3), this.noWhitespaceValidator]],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(010|011|012|015)[0-9]{8}$/),
            this.egyptianPhoneValidator,
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  // Custom Validators
  private noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace && control.value ? { whitespace: true } : null;
  }

  private egyptianPhoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const validPrefixes = ['010', '011', '012', '015'];
    const hasValidPrefix = validPrefixes.some((prefix) => value.startsWith(prefix));

    if (!hasValidPrefix) {
      return { invalidPrefix: true };
    }

    if (value.length !== 11) {
      return { invalidLength: true };
    }

    return null;
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
  get fullName() {
    return this.registerForm.get('full_name');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get passwordConfirmation() {
    return this.registerForm.get('password_confirmation');
  }

  // Only allow numbers in phone input
  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.phone?.setValue(input.value);
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
    const field = this.registerForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.touched || this.isSubmitted()));
  }

  // Get error message for field
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);

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

    if (this.registerForm.valid) {
      this.isLoading.set(true);

      const registerData: IRegister = this.registerForm.value;

      this.authService.register(registerData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (response) => {
          this.isLoading.set(false);

          this.isSubmitted.set(false);
          const phone = this.phone?.value;

          if (phone) {
            this.router.navigate(['/verify-otp', phone]);
          } else {
            toast.error('please enter your phone number');
          }
          toast.success(response.message);
          this.registerForm.reset();
        },
        error: (error) => {
          this.isLoading.set(false);
          const errorMessage = error?.error?.message || 'Registration failed. Please try again.';
          toast.error(errorMessage);
          console.error('Registration error:', error);
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}
