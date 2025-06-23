import { Component } from '@angular/core';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../core/services/breadcrumb.service';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  standalone: false,
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent {
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private bcService: BreadcrumbService) {
    this.breadcrumbs$ = this.bcService.breadcrumbs$;
  }
}
