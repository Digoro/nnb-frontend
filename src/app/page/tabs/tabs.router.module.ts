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
        }]
      },
      {
        path: 'my-info-detail/:id', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../my-info-detail/my-info-detail.module').then(m => m.MyInfoDetailPageModule)
        }]
      },
      {
        path: 'more', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../more/more.module').then(m => m.MorePageModule)
        }]
      },
      {
        path: 'meeting-request/:id', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../meeting-request/meeting-request.module').then(m => m.MeetingRequestPageModule)
        }]
      },
      {
        path: 'meeting-detail/:id', children: [{
          path: '', loadChildren: () =>
            import('../meeting-detail/meeting-detail.module').then(m => m.MeetingDetailPageModule)
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
        path: 'payment/select/:mid', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../payment-select/payment-select.module').then(m => m.PaymentSelectModule)
        }]
      },
      {
        path: 'payment/pay', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../payment-pay/payment-pay.module').then(m => m.PaymentPayModule)
        }]
      },
      {
        path: 'payment-success/:id', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../payment-success/payment-success.module').then(m => m.PaymentSuccessPageModule)
        }]
      },
      {
        path: 'payment-fail', canActivateChild: [AuthGuard], children: [{
          path: '', loadChildren: () =>
            import('../payment-fail/payment-fail.module').then(m => m.PaymentFailPageModule)
        }]
      },
      {
        path: 'feed', children: [{
          path: '', loadChildren: () =>
            import('../feed/feed.module').then(m => m.FeedPageModule)
        }]
      },
      {
        path: 'feed-detail/:id', children: [{
          path: '', loadChildren: () =>
            import('../feed-detail/feed-detail.module').then(m => m.FeedDetailPageModule)
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
        path: 'static/:type', children: [{
          path: '', loadChildren: () =>
            import('../static/static.module').then(m => m.StaticPageModule)
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
