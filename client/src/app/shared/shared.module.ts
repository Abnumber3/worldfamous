import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationControlsComponent } from './pagination-controls.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    PaginationControlsComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],

  exports: [
    PaginationControlsComponent,
    BreadcrumbComponent
  ]
})
export class SharedModule { }
