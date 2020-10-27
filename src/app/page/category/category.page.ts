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
      image: '/assets/category/travel.png',
      key: '여행'
    },
    {
      title: "취미",
      image: '/assets/category/hobby.png',
      key: '취미'
    },
    {
      title: "운동",
      image: '/assets/category/exersise.png',
      key: '운동'
    },
    {
      title: "모임",
      image: '/assets/category/meeting.png',
      key: '모임'
    },
    {
      title: "교육",
      image: '/assets/category/education.png',
      key: '교육'
    },
    {
      title: "사회공헌",
      image: '/assets/category/social.png',
      key: '사회공헌'
    },
  ]
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
