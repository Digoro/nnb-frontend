import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { MagazineAddPage } from './magazine-add.page';

const routes: Routes = [
  {
    path: '',
    component: MagazineAddPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MagazineAddPage]
})
export class MagazineAddPageModule { }
