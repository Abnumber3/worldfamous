import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
baseUrl = 'https://localhost:5187/api/'




  constructor(private https: HttpClient) { }
}
