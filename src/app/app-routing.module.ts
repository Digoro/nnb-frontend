import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HostPage } from './page/host/host.page';
import { HostedMeetingsPage } from './page/hosted-meetings/hosted-meetings.page';
import { MeetingAddPage } from './page/meeting-add/meeting-add.page';
import { MeetingEditPage } from './page/meeting-edit/meeting-edit.page';
import { MeetingManagementPage } from './page/meeting-management/meeting-management.page';
import { AuthGuard } from './service/auth-guard.service';
import { CanDeactivateGuard } from './service/can-deactivate.guard';

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
            path: 'meeting-add', component: MeetingAddPage, canDeactivate: [CanDeactivateGuard]
          },
          {
            //RoleGuard 추가 필요
            path: 'meeting-edit/:id', component: MeetingEditPage, canDeactivate: [CanDeactivateGuard]
          },
        ]
      },
      {
        path: 'reservation',
        loadChildren: () => import('../app/page/reservation/reservation.module').then(m => m.ReservationPageModule),
      }
    ]
  },
  { path: '', loadChildren: () => import('./page/tabs/tabs.module').then(m => m.TabsPageModule) },
  {
    path: 'my-info-detail',
    loadChildren: () => import('./page/my-info-detail/my-info-detail.module').then(m => m.MyInfoDetailPageModule)
  },
  {
    path: 'payment-success',
    loadChildren: () => import('./page/payment-success/payment-success.module').then(m => m.PaymentSuccessPageModule)
  },
  {
    path: 'payment-fail',
    loadChildren: () => import('./page/payment-fail/payment-fail.module').then(m => m.PaymentFailPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
