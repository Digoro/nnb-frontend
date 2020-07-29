import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { PaymentManagementPage } from './payment-management.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentManagementPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaymentManagementPage]
})
export class PaymentManagementPageModule { }
