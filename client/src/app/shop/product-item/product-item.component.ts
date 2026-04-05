import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '../../shared/models/product';
import { BasketService } from '../../basket/basket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-item',
  standalone: false,
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent implements OnInit {
@Input() product!: IProduct;
constructor(
  private basketService: BasketService,
  private router: Router
) { }

ngOnInit(): void {
    
}


addItemtoBasket() {
this.basketService.addItemToBasket(this.product);
}

goToDetails(event?: Event) {
  event?.preventDefault();
  this.router.navigate(['/shop', this.product.id]);
}

stopCardClick(event: Event) {
  event.stopPropagation();
}
}
