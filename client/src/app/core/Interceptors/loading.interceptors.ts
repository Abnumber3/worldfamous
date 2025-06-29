import { HttpInterceptor, HttpRequest, HttpHandler,HttpEvent } from "@angular/common/http";
import { delay, delayWhen, finalize, Observable } from "rxjs";
import { BusyService } from "../services/busy.service";
import { Injectable } from "@angular/core";
import { inject } from "@angular/core";


@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private busyService: BusyService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.busyService.busy();
    return next.handle(req).pipe(
      delay(1000), // Optional: delay the response for 1 second
      finalize(() => {
        this.busyService.idle();
      })
    );
  }
}