import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { MeetingRequestPage } from './meeting-request.page';

const routes: Routes = [
  {
    path: '',
    component: MeetingRequestPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MeetingRequestPage]
})
export class MeetingRequestPageModule { }
