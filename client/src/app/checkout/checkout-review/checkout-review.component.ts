import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from '../../basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from '../../basket/payment.service';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-checkout-review',
  standalone: false,
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss'
})
export class CheckoutReviewComponent {

  @Input() checkoutForm!: FormGroup;
  @Input() appStepper?: CdkStepper;


  constructor(
    private basketService: BasketService,
    private toastr: ToastrService,
    private paymentService: PaymentService
  ){}

  createPaymentIntent() {
    const basket = this.basketService.getCurrentBasketValue();
    this.appStepper?.next();

    if (!basket) {
      this.toastr.error('No basket found');
      return;
    }

    this.paymentService.createPaymentIntent(basket.id).subscribe({
      next: updatedBasket => {
        this.basketService.setBasket(updatedBasket).subscribe();
        
        // this.toastr.success('Payment intent created');
      },
      error: error => {
        this.toastr.error(error.message || 'Failed to create payment intent');
      }
    });
  }
}

   




