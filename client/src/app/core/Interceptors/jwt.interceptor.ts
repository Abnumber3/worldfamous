
import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { HttpInterceptor } from "@angular/common/http";
import { HttpInterceptorFn } from "@angular/common/http";
import { Observable, take } from "rxjs";
import { AccountService } from "../../account/account.service";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  token?: string;

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.accountService.currentUser$.pipe(take(1)).subscribe({next: user => this.token =user?.token})
    if (this.token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${this.token}` }







    return next.handle(request);
  }
}
