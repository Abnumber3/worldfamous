import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../shared/models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
product: IProduct | null = null;


constructor(
  private shopService: ShopService,
  private activatedRoute: ActivatedRoute
) { }


ngOnInit(){
this.loadProduct();
}


loadProduct() {
  const id = this.activatedRoute.snapshot.paramMap.get('id');
  if (id === null) {
    console.error('No ID in route');
    return;
  }

  this.shopService.getProduct(+id).subscribe({
    next: (product) => {
      this.product = product;
    },
    error: (error) => {
      console.error('Error loading product:', error);
    }
  });
}

}
