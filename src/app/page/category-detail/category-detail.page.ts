import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductStatus } from 'src/app/model/product';
import { ProductService } from 'src/app/service/meeting.service';
import { CategoryType } from './../../model/category';

@Component({
  selector: 'category-detail',
  templateUrl: './category-detail.page.html',
  styleUrls: ['./category-detail.page.scss'],
})
export class CategoryDetailPage implements OnInit {
  category: string;
  categoryIndex: number;
  meetings: Product[];
  currentPage: number;
  nextPage: number;

  constructor(
    private meetingService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryIndex = +params.category + 1
      this.setMeetings(this.categoryIndex);
      this.category = Object.values(CategoryType)[+params.category];
    })
  }

  setMeetings(categoryIndex: number) {
    this.meetingService.search({ page: 1, limit: 12, categoryId: categoryIndex, status: ProductStatus.ENTERED }).subscribe(resp => {
      this.meetings = resp.items;
      this.setPagination(resp.meta);
      if (resp.items.length === 0) {
        alert('아직 모임이 없습니다. 더 많은 컨텐츠를 기대해주세요~!');
        this.router.navigate(['/tabs/category'])
      }
    })
  }

  loadData(event) {
    if (this.currentPage < this.nextPage) {
      this.meetingService.search({ page: +this.nextPage, limit: 12, categoryId: this.categoryIndex, status: ProductStatus.ENTERED }).subscribe(resp => {
        this.meetings = [...this.meetings, ...resp.items];
        this.setPagination(resp.meta);
        event.target.complete();
      })
    } else event.target.disabled = true;
  }

  private setPagination(meta) {
    this.currentPage = +meta.currentPage;
    const lastPage = +meta.totalPages;
    if (this.currentPage + 1 <= lastPage) {
      this.nextPage = this.currentPage + 1;
    }
  }
}
