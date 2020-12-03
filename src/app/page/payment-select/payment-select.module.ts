import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { PaymentSelectPage } from './payment-select.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentSelectPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaymentSelectPage]
})
export class PaymentSelectModule { }
