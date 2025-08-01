import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from '../../shared/models/product';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-product-item',
  standalone: false,
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent implements OnInit {
@Input() product!: IProduct;
constructor(private basketService: BasketService) { }

ngOnInit(): void {
    
}


addItemtoBasket() {
this.basketService.addItemToBasket(this.product);
}
}
