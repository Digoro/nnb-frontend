import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { MagazinePage } from './magazine.page';
const routes: Routes = [
  {
    path: '',
    component: MagazinePage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    MagazinePage
  ]
})
export class MagazinePageModule { }
