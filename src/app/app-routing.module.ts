import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CreateDatasetComponent } from './create-dataset/create-dataset.component';
import { ResultComponent } from './result/result.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'create-dataset',
    component: CreateDatasetComponent
  },
  {
    path: 'result',
    component: ResultComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }), FormsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
