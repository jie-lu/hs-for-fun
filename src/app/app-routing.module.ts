import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CardResolver } from './resovlers/card-resolver';
import { FanPanelComponent } from './fan-panel/fan-panel.component';


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
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
