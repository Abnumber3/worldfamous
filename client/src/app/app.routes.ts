import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';
import { ProductDetailsComponent } from './shop/product-details/product-details.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'shop', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)}, // Lazy loading the Shop module
    {path: '**', redirectTo: ''} // Redirect to home for any unknown routes
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }