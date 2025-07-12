import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from './basket.service';
import { IBasket } from '../shared/models/basket';

@Component({
  selector: 'app-basket',
  standalone: false,
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent implements OnInit {
basket$!: Observable<IBasket | null>;

constructor(private basketService: BasketService) {}



ngOnInit(){
  this.basket$ = this.basketService.basket$;
}

}
