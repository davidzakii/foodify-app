import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { toast } from 'ngx-sonner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.scss',
})
export class VerifyOtp implements OnInit {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  phoneNumber: string = '';
  countdown = signal<number>(55);
  interval: any;

  isOtpComplete: boolean = false;
  ngOnInit() {
    this.phoneNumber = this.activatedRoute.snapshot.paramMap.get('phoneNumber') || '';
    this.startCountdown(); // → تشغيل التايمر
  }

  startCountdown() {
    if (this.interval) clearInterval(this.interval);

    this.interval = setInterval(() => {
      if (this.countdown() > 0) {
        this.countdown.update((v) => v - 1);
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  submit(form: any) {
    form.control.markAllAsTouched();

    if (form.invalid) return;

    const otpNumber = `${form.value.number1}${form.value.number2}${form.value.number3}${form.value.number4}`;

    this.authService
      .verifyRegisterOtp(this.phoneNumber, otpNumber)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.router.navigate(['/login']);
          toast.success(res.message);
        },
      });
  }

  moveToNext(event: Event, nextInput?: HTMLInputElement) {
    const input = event.target as HTMLInputElement | null;
    if (input && input.value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }

  moveToPrev(event: KeyboardEvent, prevInput?: HTMLInputElement) {
    const input = event.target as HTMLInputElement | null;
    if (input && input.value === '' && event.key === 'Backspace' && prevInput) {
      prevInput.focus();
    }
  }

  resendCode() {
    if (this.countdown() > 0) return;

    this.authService.resendOtp(this.phoneNumber).subscribe({
      next: (res) => {
        if (res.success) {
          toast.success(res.message);
          this.startCountdown(); // إعادة تشغيل التايمر
        } else {
          toast.error(res.message);
        }
      },
    });
  }
}
