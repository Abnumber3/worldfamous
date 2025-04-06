import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'http://localhost:5187/api/';

  constructor(private http: HttpClient) { }

  getProducts(typeId?: number, sort?: string) {
    let params = new HttpParams();

    if (typeId) {
      params = params.append('typeId', typeId.toString());
    }

    if(sort) {
      params = params.append('sort', sort);
    }

    return this.http.get<IPagination>(this.baseUrl + 'Product', { observe: 'response', params })
    .pipe(
      map(response => {
        return response.body
      })
    );
  }

  getTypes(){
    return this.http.get<IType[]>(this.baseUrl + 'product/types');
  }
}
