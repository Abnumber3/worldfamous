import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../shared/models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { BasketService } from '../../basket/basket.service';  // <-- added missing import

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']  // <-- corrected typo: styleUrls
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct | null = null;
  quantity = 1;

  constructor(
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private bcService: BreadcrumbService,
    private basketService: BasketService  
  ) { 
    // Do NOT set breadcrumb here — let product load first
     this.bcService.set('@productDetail', '');
    
  }

  ngOnInit() {
    this.loadProduct();
  }

  addItemToBasket() {}

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id === null) {
      console.error('No ID in route');
      return;
    }

    this.shopService.getProduct(+id).subscribe({
      next: (product) => {
        this.product = product;
        // Only set breadcrumb after product successfully loaded
        this.bcService.set('@productDetail', product.name);
      },
      error: (error) => {
        console.error('Error loading product:', error);
      }
    });
  }
}
