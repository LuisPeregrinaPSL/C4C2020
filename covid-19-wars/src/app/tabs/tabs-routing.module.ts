import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'cities',
        loadChildren: () => import('./cities/cities.module').then(m => m.CitiesPageModule)
      },
      {
        path: 'states',
        loadChildren: () => import('./states/states.module').then(m => m.StatesPageModule)
      },
      {
        path: 'countries',
        loadChildren: () => import('./countries/countries.module').then(m => m.CountriesPageModule)
      },
      {
        path: 'me',
        loadChildren: () => import('./me/me.module').then(m => m.MePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/me',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/me',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
