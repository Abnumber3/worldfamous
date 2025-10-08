import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  constructor(
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

   }  
  loginForm!: FormGroup;

  showPassword: boolean = false;
  passwordHasValue = false;
  returnUrl!: string 
  
  ngOnInit()  {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/Shop';
  this.createLoginForm()
  }

  createLoginForm()
{
  this.loginForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
    password: new FormControl('',Validators.required)
  });
}

  onSubmit(){
    this.accountService.login(this.loginForm.value).subscribe(()=>{
      this.router.navigateByUrl(this.returnUrl);
    }, error=>{
      console.log(error);

    });

  }


  
togglePassword(): void {
  this.showPassword = !this.showPassword;
}

onPasswordInput(): void {
  const value = this.loginForm.get('password')?.value;
  this.passwordHasValue = !!value;
}

}
