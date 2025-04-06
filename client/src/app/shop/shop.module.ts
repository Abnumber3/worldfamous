import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductItemComponent } from './product-item/product-item.component';
import { ShopComponent } from './shop.component';



@NgModule({
  declarations: [
    ProductItemComponent,
    ShopComponent
  ],
  imports: [
    CommonModule,
  ],

  exports: [
    ShopComponent
  ]
})
export class ShopModule { }
