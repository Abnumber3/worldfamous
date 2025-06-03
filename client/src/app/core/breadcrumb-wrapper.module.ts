import { NgModule } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItemDirective } from 'xng-breadcrumb';

@NgModule({
  imports: [BreadcrumbComponent, BreadcrumbItemDirective],
  exports: [BreadcrumbComponent, BreadcrumbItemDirective]
})
export class BreadcrumbWrapperModule {}
