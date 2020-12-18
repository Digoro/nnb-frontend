import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { BandService } from 'src/app/service/band.service';
import { BandPost as BandPost } from './../../model/band';
import { Magazine } from './../../model/magazine';

@Component({
  selector: 'feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  magazines: Magazine[];
  bandPosts: BandPost[];
  after: string;

  constructor(
    private router: Router,
    public actionSheetController: ActionSheetController,
    private bandService: BandService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.setList();
  }

  setList() {
    this.bandService.getList().subscribe(resp => {
      this.bandPosts = resp.items;
      this.after = resp.paging.next_params.after;
    })
  }

  showComments(post_key: string) {
    this.bandService.getComments(post_key).subscribe(resp => {
      const post = this.bandPosts.find(p => p.post_key === post_key);
      post.comments = resp.items;
    })
  }

  goDetailPage(post_key: string) {
    this.router.navigate(['/tabs/feed-detail', post_key])
  }

  loadData(event) {
    this.bandService.getList(this.after).subscribe(resp => {
      this.bandPosts = [...this.bandPosts, ...resp.items];
      if (!!resp.paging.next_params) {
        this.after = resp.paging.next_params.after;
        event.target.complete();
      }
      else event.target.disabled = true;
    })
  }
}
