import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  private googleButton?: ElementRef<HTMLDivElement>;

  @ViewChild('googleButton')
  set googleButtonRef(value: ElementRef<HTMLDivElement> | undefined) {
    this.googleButton = value;
    if (value) {
      this.tryRenderGoogleButton();
    }
  }

  registerForm!: FormGroup;
  submitted = false;
  loading = false;
  googleLoading = false;
  googleEnabled = false;
  errorMessage: string | null = null;
  errors: string[] | undefined;
  returnUrl = '/shop';
  usernameStatus: 'checking' | 'taken' | 'available' | null = null;

  private readonly destroy$ = new Subject<void>();
  private googleClientId = '';
  private googleScriptPromise: Promise<void> | null = null;

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

    this.loadGoogleSignIn();
  }

  ngAfterViewInit(): void {
    this.tryRenderGoogleButton();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    (window as Window & { google?: GoogleNamespace }).google?.accounts.id.cancel();
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

    if (this.loading || this.googleLoading || this.registerForm.pending) {
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
          this.router.navigateByUrl(this.returnUrl);
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

  private loadGoogleSignIn(): void {
    this.accountService.getGoogleAuthConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (config) => {
          this.googleClientId = (config.clientId || '').trim();
          this.googleEnabled = config.enabled && !!this.googleClientId;

          if (!this.googleEnabled) {
            return;
          }

          this.loadGoogleScript()
            .then(() => window.setTimeout(() => this.tryRenderGoogleButton()))
            .catch(() => {
              this.googleEnabled = false;
              this.errorMessage = 'Google sign-in is temporarily unavailable.';
            });
        },
        error: () => {
          this.googleEnabled = false;
        }
      });
  }

  private loadGoogleScript(): Promise<void> {
    const googleWindow = window as Window & { google?: GoogleNamespace };
    if (googleWindow.google?.accounts.id) {
      return Promise.resolve();
    }

    if (this.googleScriptPromise) {
      return this.googleScriptPromise;
    }

    this.googleScriptPromise = new Promise<void>((resolve, reject) => {
      const existingScript = document.getElementById('google-identity-script') as HTMLScriptElement | null;
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-identity-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.head.appendChild(script);
    });

    return this.googleScriptPromise;
  }

  private tryRenderGoogleButton(): void {
    const googleWindow = window as Window & { google?: GoogleNamespace };
    const google = googleWindow.google;

    if (!this.googleEnabled || !this.googleClientId || !this.googleButton?.nativeElement || !google?.accounts.id) {
      return;
    }

    const buttonHost = this.googleButton.nativeElement;
    buttonHost.innerHTML = '';

    google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: (response: GoogleCredentialResponse) => this.handleGoogleCredential(response),
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signup',
      ux_mode: 'popup'
    });

    google.accounts.id.renderButton(buttonHost, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: 'continue_with',
      logo_alignment: 'left',
      width: Math.max(220, Math.min(Math.floor(buttonHost.clientWidth || 320), 360))
    });
  }

  private handleGoogleCredential(response: GoogleCredentialResponse): void {
    if (!response?.credential || this.loading || this.googleLoading) {
      return;
    }

    this.googleLoading = true;
    this.loading = true;
    this.clearErrors();

    this.accountService.loginWithGoogle(response.credential)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.googleLoading = false;
          this.loading = false;
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          this.googleLoading = false;
          this.loading = false;
          this.handleAuthError(error);
        }
      });
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
