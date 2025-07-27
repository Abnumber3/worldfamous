import { Component, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../../shared/models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { BasketService } from '../../basket/basket.service';  // <-- added missing import
import { AddToCartToastComponent } from '../../shared/components/add-to-cart-toast/add-to-cart-toast.component';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']  // <-- corrected typo: styleUrls
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct | null = null;
  quantity = 1;
  newPrice: number | null = null; // Initialize newPrice
  isAdding = false;
  @ViewChild('toast') toast!: AddToCartToastComponent;

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

addItemToBasket() {
  if (!this.product || this.isAdding) return;

  this.isAdding = true;

  this.basketService.addItemToBasket(this.product, this.quantity);
  this.toast.show(this.product, this.quantity);

  // Disable for a full second to avoid spamming
  setTimeout(() => {
    this.isAdding = false;
  }, 1000); // try 1000ms instead of 800ms
}


  incrementQuantity() {
    this.quantity++; 
    this.newPrice = this.product!.price * this.quantity; // Update price based on quantity
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.newPrice = this.product!.price / this.quantity; // Update price based on quantity
    }
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
        // Only set breadcrumb after product successfully loaded
        this.bcService.set('@productDetail', product.name);
      },
      error: (error) => {
        console.error('Error loading product:', error);
      }
    });
  }
}
