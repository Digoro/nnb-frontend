import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { MyMeetingsPage } from './my-meetings.page';

const routes: Routes = [
  {
    path: '',
    component: MyMeetingsPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyMeetingsPage]
})
export class MyMeetingsPageModule { }
