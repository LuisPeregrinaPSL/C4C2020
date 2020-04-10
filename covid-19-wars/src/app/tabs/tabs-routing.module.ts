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
        children: [
          {
            path: '',
            loadChildren: () => import('./cities/cities.module').then(m => m.CitiesPageModule)
          }
        ]
      },
      {
        path: 'states',
        children: [
          {
            path: '',
            loadChildren: () => import('./states/states.module').then(m => m.StatesPageModule)
          }
        ]
      },
      {
        path: 'countries',
        children: [
          {
            path: '',
            loadChildren: () => import('./countries/countries.module').then(m => m.CountriesPageModule)
          }
        ]
      },
      {
        path: 'config',
        loadChildren: () => import('./config/config.module').then(m => m.ConfigPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/cities',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/cities',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
