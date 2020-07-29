import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { MagazineDetailPage } from './magazine-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MagazineDetailPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    MagazineDetailPage
  ]
})
export class MagazineDetailPageModule { }
