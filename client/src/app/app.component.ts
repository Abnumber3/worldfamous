import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProduct } from './shared/models/product';
import { IPagination } from './shared/models/pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = "World Famous";
  products: IProduct[] = [];
  showSectionHeader = true;  // <--- this is the flag controlling whether breadcrumb shows

  constructor(private spinner: NgxSpinnerService, private router: Router) {}

  ngOnInit() {
    // Spinner logic (if you want to keep it)
    // this.spinner.show(undefined, {
    //   type:    'pacman',
    //   bdColor: 'rgba(255, 255, 255, 0.7)',
    //   color:   '#333333',
    // });
    // setTimeout(() => this.spinner.hide(), 3000);

    // Handle route changes to hide breadcrumb on homepage
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showSectionHeader = event.urlAfterRedirects !== '/';
    });
  }
}
