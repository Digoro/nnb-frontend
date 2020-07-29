import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/model/category';

@Component({
  selector: 'category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  categories = [
    {
      title: "여행",
      icon: "airplane-outline",
      key: 'travel'
    },
    {
      title: "취미",
      icon: "brush-outline",
      key: 'hobby'
    },
    {
      title: "학습",
      icon: "book-outline",
      key: 'education'
    },
    {
      title: "모임",
      icon: "people-outline",
      key: 'meeting'
    },
    {
      title: "건강",
      icon: "bicycle-outline",
      key: 'exercise'
    },
    {
      title: "사회공헌",
      icon: "body-outline",
      key: 'social'
    },
  ];

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  click(key: string) {
    const category = Category[key]
    this.router.navigate(['./tabs/meetings'], { queryParams: { key: category } });

  }
}
