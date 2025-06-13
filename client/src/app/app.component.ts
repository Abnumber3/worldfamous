import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProduct } from './shared/models/product';
import { IPagination } from './shared/models/pagination';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // Fixed typo (styleUrl → styleUrls)
})
export class AppComponent implements OnInit {
  title = "World Famous";
  products: IProduct[] = []; // Initialize products array

  //Setting up connection to backend
  constructor(private spinner: NgxSpinnerService) {}

ngOnInit() {
  // this.spinner.show(undefined, {
  //   type:    'pacman',
  //   bdColor: 'rgba(255, 255, 255, 0.7)',
  //   color:   '#333333',
  // });
  // setTimeout(() => this.spinner.hide(), 3000);
}
}
