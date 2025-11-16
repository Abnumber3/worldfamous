import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { SharedModule } from '../shared/shared.module';
import { CheckoutAddressComponent } from "./checkout-address/checkout-address.component";
import { CheckoutDeliveryComponent } from "./checkout-delivery/checkout-delivery.component";
import { CheckoutReviewComponent } from "./checkout-review/checkout-review.component";
import { CheckoutPaymentComponent } from "./checkout-payment/checkout-payment.component";

@NgModule({
  declarations: [
    CheckoutComponent      // 
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    SharedModule,
    CheckoutAddressComponent,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CheckoutPaymentComponent,
  
]
})
export class CheckoutModule { }
