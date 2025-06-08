import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../shared/models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';

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
  private activatedRoute: ActivatedRoute,
  private bcService: BreadcrumbService
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
      this.bcService.set('@productDetail', product.name); // Set the breadcrumb with the product name
    },
    error: (error) => {
      console.error('Error loading product:', error);
    }
  });
}

}
