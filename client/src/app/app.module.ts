import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { routes } from "./app.routes";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from "./core/core.module";
import { provideHttpClient } from '@angular/common/http';
import { ProductItemComponent } from "./shop/product-item/product-item.component";
import { ShopModule } from "./shop/shop.module";

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    routes,
    BrowserAnimationsModule,
    CoreModule,
    ShopModule
],
  providers: [
    provideHttpClient()  // This is the modern way to provide HTTP functionality
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }