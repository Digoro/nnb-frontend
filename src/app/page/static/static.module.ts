import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { StaticPage } from './static.page';

const routes: Routes = [
  {
    path: '',
    component: StaticPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StaticPage]
})
export class StaticPageModule { }
