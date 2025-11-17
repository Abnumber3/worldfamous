import { Component, ViewChild } from '@angular/core';
import { StepperComponent } from '../shared/components/stepper/stepper.component';
import { OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'; 

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup | undefined;

  constructor(private fb: FormBuilder) {}

  ngOnInit(){

  }
  Address = 'Address';
  Delivery = 'Delivery';
  Review  = 'Review';
  Payment = 'Payment';

  @ViewChild('appStepper') appStepper?: StepperComponent;



createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      // Define your form controls here
    });
  }


  goNextStep() {
    this.appStepper?.next();
  }

  goPreviousStep() {
    this.appStepper?.previous();
  }
}
