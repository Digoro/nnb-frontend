import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { MeetingEditPage } from './meeting-edit.page';

const routes: Routes = [
  {
    path: '',
    component: MeetingEditPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MeetingEditPage]
})
export class MeetingEditPageModule { }
