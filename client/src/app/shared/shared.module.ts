import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationControlsComponent } from './pagination-controls.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { CarouselModule } from 'ngx-bootstrap/carousel'; // 
import { RouterModule } from '@angular/router';
import { OrderToolsComponent } from './components/order-tools/order-tools.component';


@NgModule({
  declarations: [
    PaginationControlsComponent,
    BreadcrumbComponent,
    OrderToolsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule.forRoot() // Assuming CarouselModule is imported from ngx-bootstrap or similar
  ],

  exports: [
    PaginationControlsComponent,
    BreadcrumbComponent,
    CarouselModule,
    OrderToolsComponent
  ]
})
export class SharedModule { }
