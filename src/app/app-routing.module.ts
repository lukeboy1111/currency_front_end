import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrenciesComponent } from './currencies/currencies.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { SavedComponent } from './saved/saved.component';
import { CallbackComponent } from './callback/callback.component'
import { OktaAuthGuard } from './app.guard';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'currencies',
    component: CurrenciesComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'saved',
    component: SavedComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'callback',
    component: CallbackComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }