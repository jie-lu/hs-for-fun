import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CardResolver } from './resovlers/card-resolver';
import { FanPanelComponent } from './fan-panel/fan-panel.component';
import { CardBackMakerComponent } from './card-back-maker/card-back-maker.component';


const routes: Routes = [{ 
  path:'',
  pathMatch: 'full',
  redirectTo: 'home' 
}, { 
  path: 'home',
  component: FanPanelComponent,
  resolve: {
    defaultCardBack: CardResolver
  } 
}, { 
  path: 'canvas',
  component: CardBackMakerComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
