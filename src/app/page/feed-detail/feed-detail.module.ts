import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { FeedDetailPage } from './feed-detail.page';

const routes: Routes = [
  {
    path: '',
    component: FeedDetailPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FeedDetailPage]
})
export class FeedDetailPageModule { }
