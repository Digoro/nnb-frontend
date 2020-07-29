import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetingAddPage } from './meeting-add.page';
import { SharedModule } from 'src/app/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MeetingAddPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MeetingAddPage]
})
export class MeetingAddPageModule { }
