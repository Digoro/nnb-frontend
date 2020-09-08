import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/service/auth-guard.service';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs', component: TabsPage, children: [
      {
        path: 'home', children: [{
          path: '', loadChildren: () =>
            import('../home/home.module').then(m => m.HomePageModule)
        }]
      },
      {
        path: 'category', children: [{
          path: '', loadChildren: () =>
            import('../category/category.module').then(m => m.CategoryPageModule)
        }]
      },
      {
        path: 'my-info', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../my-info/my-info.module').then(m => m.MyInfoPageModule)
        },
        {
          path: 'my-info-edit/:id', children: [{
            path: '', loadChildren: () =>
              import('../my-info-edit/my-info-edit.module').then(m => m.MyInfoEditPageModule)
          }]
        }]
      },
      {
        path: 'more', children: [{
          path: '', loadChildren: () =>
            import('../more/more.module').then(m => m.MorePageModule)
        }]
      },
      {
        path: 'meeting-detail/:id', children: [{
          path: '', loadChildren: () =>
            import('../meeting-detail/meeting-detail.module').then(m => m.MeetingDetailPageModule)
        }]
      },
      {
        path: 'meeting-add', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../meeting-add/meeting-add.module').then(m => m.MeetingAddPageModule)
        }]
      },
      {
        //RoleGuard 추가 필요
        path: 'meeting-edit/:id', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../meeting-edit/meeting-edit.module').then(m => m.MeetingEditPageModule)
        }]
      },
      {
        path: 'meetings', children: [{
          path: '', loadChildren: () =>
            import('../search/search.module').then(m => m.SearchPageModule)
        }]
      },
      {
        path: 'profile/:id', children: [{
          path: '', loadChildren: () =>
            import('../profile/profile.module').then(m => m.ProfilePageModule)
        }]
      },
      {
        path: 'login', children: [{
          path: '', loadChildren: () =>
            import('../login/login.module').then(m => m.LoginPageModule)
        }]
      },
      {
        path: 'signup/:method', children: [{
          path: '', loadChildren: () =>
            import('../signup/signup.module').then(m => m.SignupPageModule)
        }]
      },
      {
        path: 'edit-profile', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
        }]
      },
      //TODO: edit-profile 페이지와 병합할 것
      {
        path: 'edit-individual', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../edit-individual/edit-individual.module').then(m => m.EditIndividualPageModule)
        }]
      },
      {
        path: 'payment-management', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../payment-management/payment-management.module').then(m => m.PaymentManagementPageModule)
        }]
      },
      {
        path: 'payment/:mid', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../payment/payment.module').then(m => m.PaymentPageModule)
        }]
      },
      {
        path: 'magazine', children: [{
          path: '', loadChildren: () =>
            import('../magazine/magazine.module').then(m => m.MagazinePageModule)
        }]
      },
      {
        path: 'magazine-detail/:id', children: [{
          path: '', loadChildren: () =>
            import('../magazine-detail/magazine-detail.module').then(m => m.MagazineDetailPageModule)
        }]
      },
      {
        path: 'magazine-edit/:id', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../magazine-edit/magazine-edit.module').then(m => m.MagazineEditPageModule)
        }]
      },
      {
        path: 'magazine-add', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../magazine-add/magazine-add.module').then(m => m.MagazineAddPageModule)
        }]
      },
      {
        path: 'admin', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../admin/admin.module').then(m => m.AdminPageModule)
        }]
      },
      {
        path: 'event', children: [{
          path: '', loadChildren: () =>
            import('../event/event.module').then(m => m.EventPageModule)
        }]
      },
      {
        path: 'coupon-list', children: [{
          path: '', loadChildren: () =>
            import('../coupon-list/coupon-list.module').then(m => m.CouponListPageModule)
        }]
      }
    ],
  },
  {
    path: '**',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
