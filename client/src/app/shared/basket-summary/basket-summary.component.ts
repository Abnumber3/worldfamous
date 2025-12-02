import { Component, Output, EventEmitter } from '@angular/core';
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
  @Output() removeItem = new EventEmitter<{id: number, quantity: number}>();

  constructor(public basketService: BasketService) { }

  addBasketItem(item: IBasketItem){
    this.addItem.emit(item);
  }

  removeBasketItem(id: number, quantity: number = 1){
    this.removeItem.emit({id, quantity})
  }

}
