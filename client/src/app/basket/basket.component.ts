import { Component } from '@angular/core';
import { BasketService } from './basket.service';
import { IBasketItem } from '../shared/models/basket';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-basket',
  standalone: false,
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent {
  readonly currentUser$;
  readonly checkoutQueryParams = { returnUrl: '/checkout' };

  constructor(
    public basketService: BasketService,
    private accountService: AccountService
  ) {
    this.currentUser$ = this.accountService.currentUser$;
  }



incrementQuanity(item: IBasketItem) {
  this.basketService.incrementItemQuantity(item);
}

removeItem(event: {item: IBasketItem, quantity: number}) {
  this.basketService.removeItemFromBasket(event.item, event.quantity);

}

}
