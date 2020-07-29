import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { HostPage } from './host.page';

const routes: Routes = [
  {
    path: '',
    component: HostPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HostPage]
})

export class HostPageModule { }