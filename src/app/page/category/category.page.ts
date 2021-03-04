import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryType } from './../../model/category';

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
      key: Object.keys(CategoryType).indexOf("TRAVEL")
    },
    {
      title: "취미",
      image: '/assets/category/hobby.png',
      key: Object.keys(CategoryType).indexOf("HOBBY")
    },
    {
      title: "운동",
      image: '/assets/category/exersise.png',
      key: Object.keys(CategoryType).indexOf("EXERCISE")
    },
    {
      title: "모임",
      image: '/assets/category/meeting.png',
      key: Object.keys(CategoryType).indexOf("MEETING")
    },
    {
      title: "교육",
      image: '/assets/category/education.png',
      key: Object.keys(CategoryType).indexOf("EDUCATION")
    },
    {
      title: "사회공헌",
      image: '/assets/category/social.png',
      key: Object.keys(CategoryType).indexOf("SOCIAL")
    },
  ]
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  click(key: string) {
    this.router.navigate(['./tabs/category-detail', key]);
  }
}
