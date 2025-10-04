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
        // ✅ At least one lowercase, one uppercase, one number, one special char, min 6 chars
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
  }

  // ✅ custom validator for confirm password
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // ✅ getter for green "Passwords match" message
  get passwordsMatch(): boolean {
    const pw = this.registerForm?.get('password')?.value || '';
    const cpw = this.registerForm?.get('confirmPassword')?.value || '';
    return pw.length > 0 && cpw.length > 0 && pw === cpw;
  }

  // ✅ live password validation messages
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

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/shop');
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.errorMessage = err?.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
