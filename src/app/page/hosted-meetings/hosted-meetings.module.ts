import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { HostedMeetingsPage } from './hosted-meetings.page';

const routes: Routes = [
  {
    path: '',
    component: HostedMeetingsPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HostedMeetingsPage]
})
export class HostedMeetingsPageModule { }
