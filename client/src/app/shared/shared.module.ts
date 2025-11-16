import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationControlsComponent } from './pagination-controls.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { RouterModule } from '@angular/router';
import { OrderToolsComponent } from './components/order-tools/order-tools.component';
import { AddToCartToastComponent } from './components/add-to-cart-toast/add-to-cart-toast.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TextInputComponent } from './components/text-input/text-input.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { StepperComponent } from './components/stepper/stepper.component';

@NgModule({
  declarations: [
    PaginationControlsComponent,
    BreadcrumbComponent,
    OrderToolsComponent,
    AddToCartToastComponent,
    TextInputComponent,
    StepperComponent
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    // ⬇️ feature-level imports (NO .forRoot() here)
    CarouselModule,
    BsDropdownModule,
    CdkStepperModule
  ],
  exports: [
    PaginationControlsComponent,
    BreadcrumbComponent,
    OrderToolsComponent,
    AddToCartToastComponent,
    ReactiveFormsModule,
    CarouselModule,
    BsDropdownModule,
    TextInputComponent,
    CdkStepperModule,
    StepperComponent
    
  ]
})
export class SharedModule {}
