import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../shared/models/order';

@Component({
  selector: 'app-checkout-success',
  standalone: false,
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent {
  order?: Order;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.order = navigation.extras?.state as Order;
    }

}
}