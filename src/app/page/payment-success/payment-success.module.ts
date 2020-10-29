import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { PaymentSuccessPage } from './payment-success.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentSuccessPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaymentSuccessPage]
})
export class PaymentSuccessPageModule { }
