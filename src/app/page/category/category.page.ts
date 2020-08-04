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
      key: '여행'
    },
    {
      title: "취미",
      icon: "brush-outline",
      key: '취미'
    },
    {
      title: "교육",
      icon: "book-outline",
      key: '교육'
    },
    {
      title: "모임",
      icon: "people-outline",
      key: '모임'
    },
    {
      title: "운동",
      icon: "bicycle-outline",
      key: '운동'
    },
    {
      title: "사회공헌",
      icon: "body-outline",
      key: '사회공헌'
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
