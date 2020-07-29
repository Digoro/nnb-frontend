import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { MagazineEditPage } from './magazine-edit.page';

const routes: Routes = [
  {
    path: '',
    component: MagazineEditPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MagazineEditPage]
})
export class MagazineEditPageModule { }
