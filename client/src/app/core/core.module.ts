import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { TestErrorComponent } from './test-error/test-error.component';
import { BreadcrumbWrapperModule } from './breadcrumb-wrapper.module';


@NgModule({
  declarations: [NavBarComponent, SectionHeaderComponent, TestErrorComponent],
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbWrapperModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
  ],
  exports: [
    NavBarComponent,
    SectionHeaderComponent
  ]
})
export class CoreModule { }
