import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationControlsComponent } from './pagination-controls.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { CarouselModule } from 'ngx-bootstrap/carousel'; // 
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    PaginationControlsComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule.forRoot() // Assuming CarouselModule is imported from ngx-bootstrap or similar
  ],

  exports: [
    PaginationControlsComponent,
    BreadcrumbComponent,
    CarouselModule
  ]
})
export class SharedModule { }
