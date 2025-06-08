import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router
} from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        // 1) start fresh with Home
        const breadcrumbs: Breadcrumb[] = [{ label: 'Home', url: '/' }];
        // 2) walk the tree and fill in Shop, Product Details, etc.
        this.addBreadcrumbs(this.route.root, '', breadcrumbs);
        this._breadcrumbs$.next(breadcrumbs);
      });
  }

  /**
   * Set a breadcrumb label by its alias.
   * @param alias The alias of the breadcrumb to set.
   * @param label The new label for the breadcrumb.
   */
  set(alias: string, label: string) {
    const current = this._breadcrumbs$.getValue();
    const updated = current.map(b =>
      b.label === alias ? { ...b, label } : b
    );
    this._breadcrumbs$.next(updated);
  }

  private addBreadcrumbs(
    route: ActivatedRoute,
    url: string,
    breadcrumbs: Breadcrumb[]
  ): void {
    for (const child of route.children) {
      if (child.outlet !== PRIMARY_OUTLET) continue;

      // build up the URL
      const segment = child.snapshot.url.map(s => s.path).join('/');
      if (segment) {
        url += `/${segment}`;
      }

      // grab static or dynamic label
      let label = child.snapshot.data['breadcrumb'];
      if (typeof label === 'function') {
        label = label(child.snapshot);
      }

      // only push if label exists *and* it's not the same as the last one
      if (label) {
        const last = breadcrumbs[breadcrumbs.length - 1];
        if (!last || last.label !== label) {
          breadcrumbs.push({ label, url });
        }
      }

      // recurse deeper
      this.addBreadcrumbs(child, url, breadcrumbs);
    }
  }
}
