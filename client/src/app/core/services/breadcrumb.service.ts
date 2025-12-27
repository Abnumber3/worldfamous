import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivationEnd,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router
} from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { Order } from '../../shared/models/order';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  // Holds dynamic labels for aliases like "@productDetail"
  private readonly labelMap = new Map<string, string>();

  constructor(private router: Router, private route: ActivatedRoute) {
    // Rebuild on each navigation end
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.recomputeBreadcrumbs();
      });
  }

  /**
   * Public method to set a dynamic label.
   */
set(alias: string, label: string): void {
  console.log('[BreadcrumbService] set:', alias, '→', label);
  this.labelMap.set(alias, label);
  this.recomputeBreadcrumbs();
}

  /**
   * Rebuilds the entire breadcrumb trail from the root.
   */
  private recomputeBreadcrumbs() {
    const breadcrumbs: Breadcrumb[] = [{ label: 'Home', url: '/' }];
    this.addBreadcrumbs(this.route.root, '', breadcrumbs);
    console.log('[BreadcrumbService] new breadcrumbs:', breadcrumbs);
    this._breadcrumbs$.next(breadcrumbs);
  }

  /**
   * Recursively walks the ActivatedRoute tree to build breadcrumbs.
   */
  private addBreadcrumbs(
    route: ActivatedRoute,
    url: string,
    breadcrumbs: Breadcrumb[]
  ): void {
    for (const child of route.children) {
      if (child.outlet !== PRIMARY_OUTLET) continue;

      // Build URL segment
      const segment = child.snapshot.url.map(s => s.path).join('/');
      if (segment) {
        url += `/${segment}`;
      }

      // Grab the breadcrumb data (could be string or function)
      let label = child.snapshot.data['breadcrumb'];
      if (typeof label === 'function') {
        label = label(child.snapshot);
      }

      // If it's an alias (starts with '@'), resolve from labelMap
      if (typeof label === 'string' && label.startsWith('@')) {
        const dynamic = this.labelMap.get(label);
        label = dynamic ?? ''; // if no dynamic value, treat as empty
      }

      // Only push if we have a label
      if (label) {
        const last = breadcrumbs[breadcrumbs.length - 1];
        if (!last || last.label !== label) {
          breadcrumbs.push({ label, url });
        }
      }

      this.addBreadcrumbs(child, url, breadcrumbs);
    }
  }
}
