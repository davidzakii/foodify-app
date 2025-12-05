import { NgClass } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword implements OnInit {
  forgotPasswordForm!: FormGroup;
  showPassword = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  ngOnInit(): void {
    this.initForm();
  }
  private initForm(): void {
    this.forgotPasswordForm = this.fb.group({
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(010|011|012|015)[0-9]{8}$/),
          this.egyptianPhoneValidator,
        ],
      ],
    });
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
  get phoneNumber() {
    return this.forgotPasswordForm.get('phoneNumber');
  }
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.touched || this.isSubmitted()));
  }
  onSubmit() {
    this.isSubmitted.set(true);
    const { phoneNumber } = this.forgotPasswordForm.value || '';
    if (this.forgotPasswordForm.valid) {
      this.isLoading.set(true);
      this.authService
        .forgotPassword(phoneNumber)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.isLoading.set(false);
            this.isSubmitted.set(false);
            this.forgotPasswordForm.reset();
            toast.success(res.message);
            this.router.navigate(['/reset-password', phoneNumber]);
          },
          error: () => {
            this.isLoading.set(false);
            this.isSubmitted.set(false);
          },
        });
    } else {
      Object.keys(this.forgotPasswordForm.controls).forEach((key) => {
        this.forgotPasswordForm.get(key)?.markAsTouched();
      });
    }
  }
  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.phoneNumber?.setValue(input.value);
  }
}
