import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductItemComponent } from './product-item/product-item.component';
import { ShopComponent } from './shop.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ProductItemComponent,
    ShopComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],

  exports: [
    ShopComponent
  ]
})
export class ShopModule { }
