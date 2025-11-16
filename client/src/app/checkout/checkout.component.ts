import { Component, ViewChild } from '@angular/core';
import { StepperComponent } from '../shared/components/stepper/stepper.component';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  Address = 'Address';
  Delivery = 'Delivery';
  Review  = 'Review';
  Payment = 'Payment';

  @ViewChild('appStepper') appStepper?: StepperComponent;

  goNextStep() {
    this.appStepper?.next();
  }

  goPreviousStep() {
    this.appStepper?.previous();
  }
}
