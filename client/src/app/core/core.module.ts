import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BreadcrumbComponent } from '../shared/breadcrumb/breadcrumb.component';

import { SectionHeaderComponent } from './section-header/section-header.component';
import { TestErrorComponent } from './test-error/test-error.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [NavBarComponent, SectionHeaderComponent, TestErrorComponent,],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
  ],
  exports: [
    NavBarComponent,
    SectionHeaderComponent,
    SharedModule,
  ]
})
export class CoreModule { }
