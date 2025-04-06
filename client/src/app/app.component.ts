import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProduct } from './shared/models/product';
import { IPagination } from './shared/models/pagination';

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
  constructor() {}

  ngOnInit(): void {
    
  }
}
