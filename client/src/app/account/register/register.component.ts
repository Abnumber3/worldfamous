import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
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

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;
    this.errors = undefined;

    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/shop');
        this.loading = false;
      },
      error: (err) => {
        console.error('Registration error:', err);

        // ✅ Case 1: backend sends errors at the root
        if (Array.isArray(err.errors)) {
          this.errors = err.errors;
          this.errorMessage = null;
        }
        // ✅ Case 2: backend sends errors under err.error
        else if (Array.isArray(err.error?.errors)) {
          this.errors = err.error.errors;
          this.errorMessage = null;
        }
        // ✅ Case 3: backend sends a single error string
        else if (typeof err.errors === 'string') {
          this.errorMessage = err.errors;
          this.errors = undefined;
        }
        else if (typeof err.error?.errors === 'string') {
          this.errorMessage = err.error.errors;
          this.errors = undefined;
        }
        // ✅ Case 4: message property
        else if (err.message) {
          this.errorMessage = err.message;
          this.errors = undefined;
        }
        else if (err.error?.message) {
          this.errorMessage = err.error.message;
          this.errors = undefined;
        }
        // ✅ Last fallback
        else {
          this.errorMessage = "An unknown error occurred. Please try again.";
          console.log('raw err =', err);
        }

        this.loading = false;
      }
    });
  }
}
