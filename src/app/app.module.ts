import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HandContainerComponent } from './hand-container/hand-container.component';
import { AppBaseUrlInterceptor } from './app-base-url-interceptor';
import { CardResolver } from './resovlers/card-resolver';
import { CardFanComponent } from './card-fan/card-fan.component';

@NgModule({
   declarations: [
      AppComponent,
      HandContainerComponent,
      CardFanComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      AppRoutingModule
   ],
   providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AppBaseUrlInterceptor, multi: true },
      CardResolver
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
