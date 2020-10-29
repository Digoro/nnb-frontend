import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { PaymentFailPage } from './payment-fail.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentFailPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaymentFailPage]
})
export class PaymentFailPageModule { }
