import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';
import { ProductDetailsComponent } from './shop/product-details/product-details.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { NotFoundComponent } from './core/not-found/not-found.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'test-error', component: TestErrorComponent, data: {breadcrumb: 'Test Error'}}, // Route for testing errors
    {path: 'server-error', component: ServerErrorComponent, data: {breadcrumb: 'Server Error'}},
    {path: 'not-found', component:NotFoundComponent, data: {breadcrumb: 'Server Error'}},
    {
      path: 'shop', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)
    
    }, // Lazy loading the Shop module
    {path: '**', redirectTo: ''} // Redirect to home for any unknown routes
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }