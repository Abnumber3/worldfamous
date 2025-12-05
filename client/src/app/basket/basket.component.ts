import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from './basket.service';
import { IBasket, IBasketItem } from '../shared/models/basket';

@Component({
  selector: 'app-basket',
  standalone: false,
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent {


constructor(public basketService: BasketService) {}



incrementQuanity(item: IBasketItem) {
  this.basketService.incrementItemQuantity(item);
}

// removeItem(event: {id: number, quantity: number}) {
//   this.basketService.removeItemFromBasket(event.id, event.quantity);

// }

}
