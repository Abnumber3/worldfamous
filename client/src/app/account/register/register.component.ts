import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { debounceTime, map, switchMap, of, catchError } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage: string | null = null;
  errors: string[] | undefined;

  // Live username state for UI feedback
  usernameStatus: 'tooShort' | 'checking' | 'taken' | 'available' | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createRegisterForm();

    this.registerForm.get('username')!.valueChanges.subscribe((v: string) => {
    const len = (v || '').trim().length;
    if (len < 6) this.usernameStatus = null; // hide old "available"/"taken"
  });
  }



  private createRegisterForm() {
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
         
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/)

        ]
      ],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
  }

  private usernameAsyncValidator(): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const username = (control.value || '').trim();

    if (username.length < 6) {
      // Don't set status here; async validators don't run while minlength fails
      return of(null);
    }

    this.usernameStatus = 'checking';

    return of(username).pipe(
      debounceTime(400),
      switchMap(name =>
        this.accountService.checkUsernameExists(name).pipe(
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
  get emailInvalid(): boolean {
  const control = this.registerForm.get('email');
  return (
    !!control &&
    this.submitted &&                       // only show after submit
    control.invalid &&                      // invalid email
    (control.errors?.['pattern'] || control.errors?.['required'])
  );
}



  get usernameTooShort(): boolean {
  const v: string = this.registerForm?.get('username')?.value || '';
  const len = v.trim().length;
  return len > 0 && len < 6; // show only when user started typing and is < 6
}

  // ✅ Password match validator
  private passwordsMatchValidator(form: FormGroup) {
    const pw = form.get('password')?.value;
    const cpw = form.get('confirmPassword')?.value;
    return pw === cpw ? null : { mismatch: true };
  }

  get passwordsMatch(): boolean {
    const pw = this.registerForm?.get('password')?.value || '';
    const cpw = this.registerForm?.get('confirmPassword')?.value || '';
    return pw.length > 0 && cpw.length > 0 && pw === cpw;
  }

  get passwordsMismatch(): boolean {
    const pw = this.registerForm?.get('password')?.value || '';
    const cpw = this.registerForm?.get('confirmPassword')?.value || '';
    return pw.length > 0 && cpw.length > 0 && pw !== cpw;
  }

  // ✅ Dynamic password validation messages
  get passwordErrors(): string[] {
    const pw = this.registerForm?.get('password')?.value || '';
    const messages: string[] = [];

    if (!/[A-Z]/.test(pw)) messages.push('At least one uppercase letter');
    if (!/[a-z]/.test(pw)) messages.push('At least one lowercase letter');
    if (!/\d/.test(pw)) messages.push('At least one number');
    if (!/[\W_]/.test(pw)) messages.push('At least one special character');
    if (pw.length < 6) messages.push('Minimum length of 6 characters');

    return messages;
  }

  // ✅ Form submission
 onSubmit() {
  this.submitted = true;
  console.log('🟢 onSubmit triggered');

  // 🔍 Detailed form diagnostics
  console.log('Form status:', this.registerForm.status);
  console.log('Form pending:', this.registerForm.pending);
  console.log('Form value:', this.registerForm.value);

  // Log each control validity for debugging
  console.log('Form controls validity:');
  Object.keys(this.registerForm.controls).forEach(key => {
    const control = this.registerForm.get(key);
    console.log(
      `   ${key} =>`,
      control?.status,
      control?.errors ? control.errors : '✅ valid'
    );
  });

  // Stop if async validators still running
  if (this.registerForm.pending) {
    console.warn('⚠️ Form is still pending (async validator not finished). Wait a sec...');
    return;
  }

  // Stop if any field invalid
  if (this.registerForm.invalid) {
    console.warn('❌ Form invalid. Please fix highlighted errors.');
    return;
  }

  // At this point: everything valid
  this.loading = true;
  this.errorMessage = null;
  this.errors = undefined;

  // Normalize and prepare the payload for backend
  const formData = {
    username: this.registerForm.value.username.trim().toLowerCase(),
    displayName: this.registerForm.value.username.trim(), // ✅ map username → displayName
    email: this.registerForm.value.email.trim(),
    password: this.registerForm.value.password
  };

  console.log('📦 Submitting payload:', formData);

  // Call API
  this.accountService.register(formData).subscribe({
    next: (user) => {
      console.log('✅ Registration success:', user);
      this.loading = false;
      this.router.navigateByUrl('/shop');
    },
    error: (err) => {
      this.loading = false;
      console.error('❌ Registration error (raw):', err);

      // ✅ Handle structured API validation errors
      if (Array.isArray(err?.error?.errors) && err.error.errors.length > 0) {
        this.errors = err.error.errors;
        this.errorMessage = null;
        console.warn('⚠️ API validation errors:', this.errors);
        return;
      }

      if (Array.isArray(err?.errors) && err.errors.length > 0) {
        this.errors = err.errors;
        this.errorMessage = null;
        console.warn('⚠️ API validation errors (fallback):', this.errors);
        return;
      }

      if (typeof err?.error?.errors === 'string') {
        this.errorMessage = err.error.errors;
        console.warn('⚠️ String error from server:', this.errorMessage);
        return;
      }

      if (err?.error?.message) {
        this.errorMessage = err.error.message;
        console.warn('⚠️ Server message:', this.errorMessage);
        return;
      }

      if (err?.message) {
        this.errorMessage = err.message;
        console.warn('⚠️ Generic error message:', this.errorMessage);
        return;
      }

      // 🟥 Final fallback
      this.errorMessage = 'An unknown error occurred. Please try again.';
      console.warn('⚠️ No recognizable error shape.');
    }
  });
}



}
