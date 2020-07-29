import { SharedModule } from 'src/app/shared.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyInfoPage } from './my-info.page';

const routes: Routes = [
  {
    path: '',
    component: MyInfoPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyInfoPage]
})
export class MyInfoPageModule { }
