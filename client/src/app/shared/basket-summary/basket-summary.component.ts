import { Component, Output, EventEmitter, Input } from '@angular/core';
import { IBasketItem } from '../models/basket';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-basket-summary',
  standalone: false,
  templateUrl: './basket-summary.component.html',
  styleUrl: './basket-summary.component.scss'
})
export class BasketSummaryComponent {
  @Output() addItem = new EventEmitter<IBasketItem>();
  @Output() removeItem = new EventEmitter<{item: IBasketItem, quantity: number}>();
  @Input() isBasket = true;
  
  constructor(public basketService: BasketService) { }

  addBasketItem(item: IBasketItem){
    this.addItem.emit(item);
  }

  removeBasketItem(item: IBasketItem, quantity: number = 1){
    this.removeItem.emit({item, quantity})
  }

}
