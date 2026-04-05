import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, map, of, switchMap, takeUntil, timer } from 'rxjs';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage: string | null = null;
  errors: string[] | undefined;
  returnUrl = '/shop';
  usernameStatus: 'checking' | 'taken' | 'available' | null = null;
  private readonly postRegisterRoute = '/shop';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/shop';
    this.createRegisterForm();

    this.registerForm
      .get('username')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if ((value || '').trim().length < 6) {
          this.usernameStatus = null;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get emailInvalid(): boolean {
    const control = this.registerForm.get('email');
    return !!control &&
      this.submitted &&
      control.invalid &&
      (control.errors?.['pattern'] || control.errors?.['required']);
  }

  get usernameTooShort(): boolean {
    const value: string = this.registerForm?.get('username')?.value || '';
    const length = value.trim().length;
    return length > 0 && length < 6;
  }

  get passwordsMatch(): boolean {
    const password = this.registerForm?.get('password')?.value || '';
    const confirmPassword = this.registerForm?.get('confirmPassword')?.value || '';
    return password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  }

  get passwordsMismatch(): boolean {
    const password = this.registerForm?.get('password')?.value || '';
    const confirmPassword = this.registerForm?.get('confirmPassword')?.value || '';
    return password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword;
  }

  get passwordErrors(): string[] {
    const password = this.registerForm?.get('password')?.value || '';
    if (!password) {
      return [];
    }

    const messages: string[] = [];

    if (!/[A-Z]/.test(password)) messages.push('At least one uppercase letter');
    if (!/[a-z]/.test(password)) messages.push('At least one lowercase letter');
    if (!/\d/.test(password)) messages.push('At least one number');
    if (!/[\W_]/.test(password)) messages.push('At least one special character');
    if (password.length < 6) messages.push('Minimum length of 6 characters');
    if (password.length > 10) messages.push('Maximum length of 10 characters');

    return messages;
  }

  onSubmit(): void {
    this.submitted = true;
    this.registerForm.markAllAsTouched();

    if (this.loading || this.registerForm.pending) {
      return;
    }

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.clearErrors();

    const formData = {
      username: this.registerForm.value.username.trim().toLowerCase(),
      displayName: this.registerForm.value.username.trim(),
      email: this.registerForm.value.email.trim(),
      password: this.registerForm.value.password
    };

    this.accountService.register(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigateByUrl(this.postRegisterRoute);
        },
        error: (error) => {
          this.loading = false;
          this.handleAuthError(error);
        }
      });
  }

  private createRegisterForm(): void {
    this.registerForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(6)],
        [this.usernameAsyncValidator()]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,10}$/)
        ]
      ],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  private usernameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const username = (control.value || '').trim().toLowerCase();

      if (username.length < 6) {
        return of(null);
      }

      this.usernameStatus = 'checking';

      return timer(350).pipe(
        switchMap(() =>
          this.accountService.checkUsernameExists(username).pipe(
            map(exists => {
              this.usernameStatus = exists ? 'taken' : 'available';
              return exists ? { usernameTaken: true } : null;
            }),
            catchError(() => {
              this.usernameStatus = null;
              return of(null);
            })
          )
        )
      );
    };
  }

  private passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  private handleAuthError(error: any): void {
    if (Array.isArray(error?.error?.errors) && error.error.errors.length > 0) {
      this.errors = error.error.errors;
      this.errorMessage = null;
      return;
    }

    if (Array.isArray(error?.errors) && error.errors.length > 0) {
      this.errors = error.errors;
      this.errorMessage = null;
      return;
    }

    if (typeof error?.error?.errors === 'string') {
      this.errorMessage = error.error.errors;
      return;
    }

    this.errorMessage =
      error?.error?.message ||
      error?.message ||
      'Unable to complete your request right now. Please try again.';
  }

  private clearErrors(): void {
    this.errorMessage = null;
    this.errors = undefined;
  }
}
