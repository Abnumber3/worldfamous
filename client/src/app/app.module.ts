import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app.routes";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from "./core/core.module";
import { provideHttpClient } from '@angular/common/http';
import { ShopModule } from "./shop/shop.module";
import { HomeModule } from "./home/home.module";

@NgModule({
  declarations: [
    AppComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    HomeModule
],
  providers: [
    provideHttpClient()  // This is the modern way to provide HTTP functionality
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }