import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasketTotals } from '../../models/basket';
import { BasketService } from '../../../basket/basket.service';
@Component({
  selector: 'app-order-tools',
  standalone: false,
  templateUrl: './order-tools.component.html',
  styleUrl: './order-tools.component.scss'
})
export class OrderToolsComponent implements OnInit {

 basketTotal$!: Observable<IBasketTotals | null>

  constructor(private basketService: BasketService) { }

  ngOnInit(){
    this.basketTotal$ = this.basketService.basketTotal$;

  }

}
