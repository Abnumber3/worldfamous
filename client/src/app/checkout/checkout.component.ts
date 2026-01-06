import { Component, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StepperComponent } from '../shared/components/stepper/stepper.component';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  // Main checkout form
  checkoutForm!: FormGroup;

  // Step labels – grouped so it's obvious what they are
  readonly stepLabels = {
    address: 'Address',
    delivery: 'Delivery',
    review: 'Review',
    payment: 'Payment'
  };

  @ViewChild('appStepper') appStepper!: StepperComponent;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private basketService: BasketService
  
  ) {}

  ngOnInit(): void {
    this.buildCheckoutForm();
    this.getAddressFormValues();
    this.getdeliveryMethodValue();
  }

  // --- Form setup ----------------------------------------------------------

  private buildCheckoutForm(): void {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipCode: [null, Validators.required],
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required]
      })
    });
  }

  // Optional: convenience getters if you want them in template/children
  get addressForm(): FormGroup {
    return this.checkoutForm.get('addressForm') as FormGroup;
  }

  get deliveryForm(): FormGroup {
    return this.checkoutForm.get('deliveryForm') as FormGroup;
  }

  get paymentForm(): FormGroup {
    return this.checkoutForm.get('paymentForm') as FormGroup;
  }


  getAddressFormValues() { 
    this.accountService.getUserAddress().subscribe({
      next: (address) => {
        address && this.checkoutForm.get('addressForm')?.patchValue(address);
      }
    })
  }

  // --- Stepper controls ----------------------------------------------------

  nextStep(): void {
    this.appStepper?.next();
  }

  previousStep(): void {
    this.appStepper?.previous();
  }

  getdeliveryMethodValue() {
    const basket = this.basketService.getCurrentBasketValue();
    if(basket && basket.deliveryMethodId) {
      this.checkoutForm.get('deliveryForm')?.get('deliveryMethod')?.patchValue(basket.deliveryMethodId);
    }
  }


}
