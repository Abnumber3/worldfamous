import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../checkout.service';
import { BasketService } from '../../basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { IAddress } from '../../shared/models/address';
import { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeCardNumberElement, StripeCardCvcElement, StripeCardExpiryElement } from '@stripe/stripe-js';
import { Basket, IBasket } from '../../shared/models/basket';
import { firstValueFrom } from 'rxjs';
import { OrderToCreate } from '../../shared/models/order';


@Component({
  selector: 'app-checkout-payment',
  standalone: false,
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss'
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm!: FormGroup;
  @ViewChild('cardNumber') cardNumberElement?: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement?: ElementRef;
  @ViewChild('cardCvc') cardCvcElement?: ElementRef;
  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement ;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;
  cardNumberComplete = false;
  cardexpiryComplete = false;
  cardCvcComplete = false;
  cardErrors: any;
  loading = false;


  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router
  ) { }




  ngOnInit(): void {
   loadStripe('pk_test_51SjtABJ5w6kDiqt4Ly82qi66UqzRegsrbYhHOFreloQ3lodUDdGyUkCeFMTkhLOtJjz5km2L4MET3SN0whjyXMFc00Pj7txyhG').then(stripe => {
    this.stripe = stripe;
    const elements = stripe?.elements();
    if (elements) {
      this.cardNumber = elements.create('cardNumber')
      this.cardNumber.mount(this.cardNumberElement?.nativeElement)
      this.cardNumber.on('change', event =>{
        this.cardNumberComplete = event.complete;
        if(event.error) this.cardErrors = event.error.message;
        else this.cardErrors = null;
      })

      this.cardExpiry = elements.create('cardExpiry')
      this.cardExpiry.mount(this.cardExpiryElement?.nativeElement)
       this.cardExpiry.on('change', event =>{
        this.cardexpiryComplete = event.complete;
        if(event.error) this.cardErrors = event.error.message;
        else this.cardErrors = null;
      })

      this.cardCvc = elements.create('cardCvc')
      this.cardCvc.mount(this.cardCvcElement?.nativeElement)
       this.cardCvc.on('change', event =>{
        this.cardCvcComplete = event.complete;
        if(event.error) this.cardErrors = event.error.message;
        else this.cardErrors = null;
      })
    }
   })
  }


  get paymentFormComplete(){
    return this.checkoutForm.get('paymentForm')?.valid && this.cardNumberComplete && this.cardexpiryComplete && this.cardCvcComplete;
  }


  async submitOrder() {
    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue(); 

    try {
      const createdOrder = await this.createOrder(basket)
      const paymentResult = await this.confirmPaymentWithStripe(basket);
       if(paymentResult.paymentIntent){
            this.basketService.deleteLocalBasket();
            const navigationExtras: NavigationExtras = {state: createdOrder};
            this.router.navigate(['/checkout/success'], navigationExtras);
        console.log(createdOrder)
          } else {
            this.toastr.error(paymentResult.error.message);
          }
    } catch (error: any) {
      console.log(error);
      this.toastr.error(error.message);
    } finally {
      this.loading = false;
    }
    
    console.log('order submitted');
  }

 private async confirmPaymentWithStripe(basket: IBasket | null){
    if(!basket) throw new Error('Basket is null');
    const result =  this.stripe?.confirmCardPayment(basket.clientSecret!, {
          payment_method: {
            card: this.cardNumber!,
            billing_details: {
             name: this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.value
            }
          }
        });

        if(!result) throw new Error('Problem attempting payment with stripe');
        return result;
  }

  private async createOrder(basket: Basket | null){
      if (!basket) throw new Error('Basket is null');
      const orderToCreate = this.getOrderToCreate(basket);
      return firstValueFrom( this.checkoutService.createOrder(orderToCreate!));
    }

  private getOrderToCreate(basket: any): OrderToCreate {
    const deliveryMethod = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value;
    const shipToAdress = this.checkoutForm?.get('addressForm')?.value as IAddress;
    if(!deliveryMethod || !shipToAdress) throw new Error('Something Missing from basket'); 
    return{
      basketId: basket.id,
      deliveryMethodId: deliveryMethod,
      shipToAddress: shipToAdress

    }
    }

   

}
