import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: 'Home' }
  },
  {
    path: 'test-error',
    component: TestErrorComponent,
    data: { breadcrumb: 'Test Error' }
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
    data: { breadcrumb: 'Server Error' }
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: { breadcrumb: 'Not Found' }
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('./shop/shop.module').then(m => m.ShopModule),
    data: { breadcrumb: 'Shop' } // ✅ Fixed capitalization
  },

  {
    path: 'checkout',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./checkout/checkout.module').then(m => m.CheckoutModule),
    data: { breadcrumb: 'Checkout' } // ✅ Fixed capitalization
  },


  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then(m => m.AccountModule),
    data: { breadcrumb: "" } // ✅ Fixed capitalization
  },


  {
    path: 'basket',
    loadChildren: () =>
      import('./basket/basket.module').then(m => m.BasketModule),
    data: { breadcrumb: 'Basket' } // ✅ Fixed capitalization
  },


  {
    path: '**',
    redirectTo: 'not-found'
  },

  {
    path: 'orders',
    canActivate: [AuthGuard],
    loadChildren: () => import('./orders/orders.module').then(mod => mod.OrdersModule),
    data: {breadcrumb: 'Orders'}
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }