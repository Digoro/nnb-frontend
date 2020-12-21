import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BandPostDetail } from 'src/app/model/band';
import { BandService } from 'src/app/service/band.service';

@Component({
  selector: 'feed-detail',
  templateUrl: './feed-detail.page.html',
  styleUrls: ['./feed-detail.page.scss'],
})
export class FeedDetailPage implements OnInit {
  post: BandPostDetail;

  constructor(
    private route: ActivatedRoute,
    private bandService: BandService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.route.params.subscribe(resp => {
      const post_key = resp.id;
      this.bandService.get(post_key).subscribe(resp => {
        resp.result_data.post.content = this.sanitizer.bypassSecurityTrustHtml(resp.result_data.post.content as string);
        this.post = resp.result_data.post;
      })
    })
  }

  showComments(post_key: string) {
    this.bandService.getComments(post_key).subscribe(resp => {
      this.post.comments = resp.items;
    })
  }
}
