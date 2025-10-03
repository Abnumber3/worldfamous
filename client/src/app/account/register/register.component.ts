import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
 standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup | undefined

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router 
  ) { }

  ngOnInit(): void {}
    createRegisterForm(){
      this.registerForm = this.fb.group({
        displayName: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
      });
    }
 

}
