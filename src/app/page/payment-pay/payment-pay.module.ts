import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { PaymentPayPage } from './payment-pay.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentPayPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaymentPayPage]
})
export class PaymentPayModule { }
