import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private toastr: ToastrService) {}

    private isStartupCurrentUserRequest(req: HttpRequest<any>): boolean {
        return req.method === 'GET' && /\/api\/account\/?$/.test(req.url);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       return next.handle(req).pipe(
        catchError(error => {
            if (error) {
                if (this.isStartupCurrentUserRequest(req) && (error.status === 401 || error.status === 500)) {
                    return throwError(error);
                }

                if(error.status === 400) {
                    if(error.error.errors){
                        throw error.error;
                    } else {
                         this.toastr.error(error.error.message, error.error.statusCode);
                    }
                   
                }

                  if(error.status === 401) {
                    this.toastr.error(error.error.message, error.error.statusCode);
                }

                if (error.status === 404){
                    this.router.navigateByUrl('/not-found');
                }
                if (error.status === 500) {
                    const navigationExtras = { state: { error: error.error } };
                    this.router.navigateByUrl('/server-error', navigationExtras);
                }
            }
            return throwError(error);
        })
       )
    }
}
