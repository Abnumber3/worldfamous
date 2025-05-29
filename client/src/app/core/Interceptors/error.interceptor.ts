import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       return next.handle(req).pipe(
        catchError(error => {
            if (error) {
                if (error.status === 404){
                    this.router.navigateByUrl('/not-found');
                }
                if (error.status === 500) {
                    this.router.navigateByUrl('/server-error');
                }
            }
            return throwError(error);
        })
       )
    }
}