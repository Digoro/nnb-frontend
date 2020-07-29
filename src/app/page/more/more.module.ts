import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MorePage } from './more.page';
import { SharedModule } from 'src/app/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MorePage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MorePage]
})
export class MorePageModule { }
