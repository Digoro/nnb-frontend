import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { CouponListPage } from './coupon-list.page';

const routes: Routes = [
  {
    path: '',
    component: CouponListPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CouponListPage]
})
export class CouponListPageModule { }
