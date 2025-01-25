import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { routes } from "./app.routes";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
   declarations: [
    AppComponent
   ],

   imports: [
    BrowserModule,
    routes,
    BrowserAnimationsModule
   ],

   bootstrap: [AppComponent]


})

export class AppModule {}