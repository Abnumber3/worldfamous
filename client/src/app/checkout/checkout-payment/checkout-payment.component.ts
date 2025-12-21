import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../checkout.service';
import { BasketService } from '../../basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { IAddress } from '../../shared/models/address';

@Component({
  selector: 'app-checkout-payment',
  standalone: false,
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss'
})
export class CheckoutPaymentComponent {
  @Input() checkoutForm!: FormGroup;


  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService
  ) { }


  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue(); 
    if (!basket) return;
    const orderToCreate = this.getOrderToCreate(basket)
    if(!orderToCreate) return;
    this.checkoutService.createOrder(orderToCreate).subscribe({
      next: (order) =>{
        this.toastr.success('Order created successfully')
        console.log(order);
      }
    })
  }

  private getOrderToCreate(basket: any) {
    const deliveryMethod = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shipToAdress = this.checkoutForm?.get('addressForm')?.value as IAddress;
    if(!deliveryMethod || !shipToAdress) return; 
    return{
      basketId: basket.id,
      deliveryMethodId: deliveryMethod,
      shipToAddress: shipToAdress

    }
    }

   

}
