import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { MeetingManagementPage } from './meeting-management.page';

const routes: Routes = [
  {
    path: '',
    component: MeetingManagementPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MeetingManagementPage]
})
export class MeetingManagementPageModule { }
