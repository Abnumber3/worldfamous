import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationControlsComponent } from './pagination-controls.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { CarouselModule } from 'ngx-bootstrap/carousel'; // 
import { RouterModule } from '@angular/router';
import { OrderToolsComponent } from './components/order-tools/order-tools.component';
import { AddToCartToastComponent } from './components/add-to-cart-toast/add-to-cart-toast.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


@NgModule({
  declarations: [
    PaginationControlsComponent,
    BreadcrumbComponent,
    OrderToolsComponent,
    AddToCartToastComponent,
    
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot()

  ],

  exports: [
    PaginationControlsComponent,
    BreadcrumbComponent,
    CarouselModule,
    OrderToolsComponent,
    AddToCartToastComponent,
    ReactiveFormsModule,
    BsDropdownModule,
    BrowserAnimationsModule
  ]
})
export class SharedModule { }
