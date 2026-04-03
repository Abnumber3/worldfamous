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
  readonly availableSizes = ['Small', 'Medium', 'Large'];
  selectedSize: string | null = null;
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
  if (!this.product || !this.selectedSize || this.isAdding) return;

  this.isAdding = true;

  this.basketService.addItemToBasket(this.product, this.quantity, this.selectedSize);
  this.toast.show(this.product, this.quantity, this.selectedSize);

  // Disable for a full second to avoid spamming
  setTimeout(() => {
    this.isAdding = false;
  }, 1000); // try 1000ms instead of 800ms
}

  selectSize(size: string) {
    this.selectedSize = size;
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

  console.log('Route ID:', id);

  if (id === null) {
    console.error('No ID in route');
    return;
  }

  this.shopService.getProduct(+id).subscribe({
    next: (product) => {
      console.log('PRODUCT FROM API:', product);   // <-- add this
      this.product = product;
      this.selectedSize = null;
      this.bcService.set('@productDetail', product.name);
    },
    error: (error) => {
      console.error('Error loading product:', error);
    }
  });
}
}
