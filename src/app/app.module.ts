import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FanContainerComponent } from './fan-container/fan-container.component';
import { AppBaseUrlInterceptor } from './app-base-url-interceptor';
import { CardResolver } from './resovlers/card-resolver';
import { FanPanelComponent } from './fan-panel/fan-panel.component';
import { CardBackSelectorComponent } from './card-back-selector/card-back-selector.component';

@NgModule({
   declarations: [
      AppComponent,
      FanContainerComponent,
      FanPanelComponent,
      CardBackSelectorComponent
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
