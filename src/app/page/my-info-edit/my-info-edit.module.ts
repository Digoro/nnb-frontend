import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyInfoEditPage } from './my-info-edit.page';
import { SharedModule } from 'src/app/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MyInfoEditPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyInfoEditPage]
})
export class MyInfoEditPageModule { }
