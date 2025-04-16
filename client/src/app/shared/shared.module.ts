import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationControlsComponent } from './pagination-controls.component';


@NgModule({
  declarations: [
    PaginationControlsComponent,
  ],
  imports: [
    CommonModule
  ],

  exports: [
    PaginationControlsComponent
  ]
})
export class SharedModule { }
