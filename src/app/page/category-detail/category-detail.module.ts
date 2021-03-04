import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { CategoryDetailPage } from './category-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryDetailPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CategoryDetailPage]
})
export class CategoryDetailPageModule { }
