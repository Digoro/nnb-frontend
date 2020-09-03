import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./page/tabs/tabs.module').then(m => m.TabsPageModule) },
  // { path: 'coupon-list', loadChildren: () => import('./coupon-list/coupon-list.module').then(m => m.CouponListPageModule) },
  // { path: 'event', loadChildren: () => import('./page/event/event.module').then(m => m.EventPageModule) },
  // { path: 'admin', loadChildren: () => import('./page/admin/admin.module').then(m => m.AdminPageModule) },
  // { path: 'magazine-add', loadChildren: () => import('./page/magazine-add/magazine-add.module').then(m => m.MagazineAddPageModule) },
  // { path: 'magazine-edit', loadChildren: () => import('./page/magazine-edit/magazine-edit.module').then(m => m.MagazineEditPageModule) },
  // { path: 'magazine-detail', loadChildren: () => import('./page/magazine-detail/magazine-detail.module').then(m => m.MagazineDetailPageModule) },
  // { path: 'magazine', loadChildren: () => import('./page/magazine/magazine.module').then(m => m.MagazinePageModule) },
  // { path: 'payment', loadChildren: () => import('./payment/payment.module').then(m => m.PaymentPageModule) },
  // { path: 'payment-management', loadChildren: () => import('./page/payment-management/payment-management.module').then(m => m.PaymentManagementPageModule) },
  // { path: 'hosted-meetings', loadChildren: () => import('./page/hosted-meetings/hosted-meetings.module').then(m => m.HostedMeetingsPageModule) },
  // { path: 'edit-individual', loadChildren: () => import('./page/edit-individual/edit-individual.module').then(m => m.EditIndividualPageModule) },
  // { path: 'host', loadChildren: () => import('./page/host/host.module').then(m => m.HostPageModule) },
  // { path: 'search', loadChildren: () => import('./page/search/search.module').then(m => m.SearchPageModule) },
  // { path: 'meeting-edit', loadChildren: () => import('./page/meeting-edit/meeting-edit.module').then(m => m.MeetingEditPageModule) },
  // { path: 'edit-profile', loadChildren: './page/edit-profile/edit-profile.module#EditProfilerPageModule' },
  // { path: 'signup', loadChildren: './page/signup/signup.module#SignupPageModule' },
  // { path: 'login', loadChildren: './page/login/login.module#LoginPageModule' },
  // { path: 'meeting-add', loadChildren: './meeting-add/meeting-add.module#MeetingAddPageModule' },
  // { path: 'my-info-edit', loadChildren: './page/my-info-edit/my-info-edit.module#MyInfoEditPageModule' },
  // { path: 'more', loadChildren: './more/more.module#MorePageModule' },
  // { path: 'more', loadChildren: './page/more/more.module#MorePageModule' },
  // { path: 'home', loadChildren: './page/home/home.module#HomePageModule' },
  // { path: 'my-info', loadChildren: './page/my-info/my-info.module#MyInfoPageModule' },
  // { path: 'category', loadChildren: './page/category/category.module#CategoryPageModule' },
  // { path: 'meeting-detail', loadChildren: './page/meeting-detail/meeting-detail.module#MeetingDetailPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
