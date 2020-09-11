import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HostPage } from './page/host/host.page';
import { HostedMeetingsPage } from './page/hosted-meetings/hosted-meetings.page';
import { MeetingAddPage } from './page/meeting-add/meeting-add.page';
import { MeetingEditPage } from './page/meeting-edit/meeting-edit.page';
import { MeetingManagementPage } from './page/meeting-management/meeting-management.page';
import { AuthGuard } from './service/auth-guard.service';

const routes: Routes = [
  {
    path: 'host', component: HostPage, canActivateChild: [AuthGuard], children: [
      {
        path: '', redirectTo: 'meeting-management', pathMatch: 'full',
      },
      {
        path: 'meeting-management', component: MeetingManagementPage, children: [
          {
            path: '', redirectTo: 'hosted-meetings', pathMatch: 'full',
          },
          {
            path: 'hosted-meetings', component: HostedMeetingsPage
          },
          {
            path: 'meeting-add', component: MeetingAddPage
          },
          {
            //RoleGuard 추가 필요
            path: 'meeting-edit/:id', component: MeetingEditPage
          },
        ]
      },
      {
        path: 'reservation',
        loadChildren: () => import('../app/page/reservation/reservation.module').then(m => m.ReservationPageModule),
      }
    ]
  },
  { path: '', loadChildren: () => import('./page/tabs/tabs.module').then(m => m.TabsPageModule) }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
