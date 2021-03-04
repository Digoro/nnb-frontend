import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ProductService } from 'src/app/service/meeting.service';
import { Product, ProductStatus } from '../../model/product';

@Component({
  selector: 'search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  meetings: Product[];
  title: string;

  constructor(
    private route: ActivatedRoute,
    private meetingService: ProductService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(prams => {
      const { key, title } = prams;
      if (title) this.title = decodeURIComponent(title);
      let search = {};
      switch (key) {
        case 'forest': {
          search = { page: 1, limit: 12, status: ProductStatus.ENTERED, hashtag: '숲찾사' };
          break;
        }
        case 'week': {
          const now = moment().toDate().toISOString();
          const weekEnd = moment().clone().add(7, 'days').toDate().toISOString();
          search = { page: 1, limit: 12, status: ProductStatus.ENTERED, from: now, to: weekEnd };
          break;
        }
        case 'all': {
          search = { page: 1, limit: 12, status: ProductStatus.ENTERED };
          break;
        }
      }
      this.meetingService.search(search).subscribe(resp => {
        this.meetings = resp.items;
      })
    })
  }

  back() {
    this.location.back();
  }
}
