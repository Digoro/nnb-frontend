import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { MyInfoDetailPage } from './my-info-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MyInfoDetailPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyInfoDetailPage]
})
export class MyInfoDetailPageModule { }
