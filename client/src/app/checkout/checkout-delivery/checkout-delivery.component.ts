import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DeliveryMethod } from '../../shared/models/deliveryMethod';

@Component({
  selector: 'app-checkout-delivery',
  standalone: false,
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss'
})
export class CheckoutDeliveryComponent {
  @Input() checkoutForm!: FormGroup;
  deliveryMethods: DeliveryMethod [] = [];


}
