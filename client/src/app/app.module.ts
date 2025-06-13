import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app.routes";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from "./core/core.module";
import { ErrorInterceptor } from "./core/Interceptors/error.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { provideHttpClient } from '@angular/common/http';
import { ShopModule } from "./shop/shop.module";
import { HomeModule } from "./home/home.module";
import { withInterceptorsFromDi } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";   // <-- Corrected line
import { SharedModule } from "./shared/shared.module";
import { LoadingInterceptor } from "./core/Interceptors/loading.interceptors";

@NgModule({
  declarations: [
    AppComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    ShopModule,
    HomeModule,
    NgxSpinnerModule,   // <-- No more error here
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
      {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
