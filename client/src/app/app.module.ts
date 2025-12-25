import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app.routes";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from "./core/core.module";
import { ErrorInterceptor } from "./core/Interceptors/error.interceptor";
import { LoadingInterceptor } from "./core/Interceptors/loading.interceptors";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ShopModule } from "./shop/shop.module";
import { HomeModule } from "./home/home.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { BasketModule } from "./basket/basket.module";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { JwtInterceptor } from "./core/Interceptors/jwt.interceptor";
import { OrdersModule } from "./orders/orders.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    ShopModule,
    HomeModule,
    BasketModule,
    OrdersModule,
    NgxSpinnerModule,
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }, // <-- ADD THIS LINE
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
