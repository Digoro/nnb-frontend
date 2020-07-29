import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetingDetailPage } from './meeting-detail.page';
import { SharedModule } from 'src/app/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MeetingDetailPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MeetingDetailPage]
})
export class MeetingDetailPageModule { }
