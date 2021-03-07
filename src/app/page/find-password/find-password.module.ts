import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { FindPasswordPage } from './find-password.page';

const routes: Routes = [
  {
    path: '',
    component: FindPasswordPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FindPasswordPage]
})
export class FindPasswordPageModule { }
