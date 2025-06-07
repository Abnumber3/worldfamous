import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    data: { breadcrumb: 'Shop' }
  },
  {
    path: ':id',
    component: ProductDetailsComponent,
    data: { breadcrumb: 'Product Details' } // Static breadcrumb label for dynamic product routes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule {}
