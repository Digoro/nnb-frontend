import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductReview } from 'src/app/model/comment';
import { PaginationMeta } from 'src/app/model/pagination';
import { Product, ProductStatus } from 'src/app/model/product';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { CommentService } from '../../service/comment.service';
import { ProductService } from '../../service/meeting.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  selectedMenu = 'hosted';
  currentUser: User;
  profileUser: User;
  hostedProducts: Product[];
  reviews: ProductReview[];
  pageUserId: number;
  productPaginationMeta: PaginationMeta;
  reviewPaginationMeta: PaginationMeta;
  currentPage: number;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private productService: ProductService,
    private reviewService: CommentService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.authService.getCurrentNonunbubUser().subscribe(currentUser => {
        this.reviews = [];
        this.currentUser = currentUser;
        this.pageUserId = +params.id;
        this.userService.get(this.pageUserId).subscribe(user => {
          this.profileUser = user;
          this.getHostedProducts(1, this.profileUser.id);
          this.getReviews(1)
        })
      })
    })
  }

  segmentChanged(event) {
    this.selectedMenu = event.detail.value;
  }

  getReviews(page: number) {
    this.reviewService.getCommentsByUser(this.profileUser.id, page).subscribe(resp => {
      this.reviews = resp.items;
      this.reviewPaginationMeta = resp.meta;
      this.reviewPaginationMeta.paginationId = 'profile-reviews';
    })
  }

  private getHostedProducts(page: number, hostId: number) {
    this.productService.getHostedProducts(page, 10, ProductStatus.ENTERED, hostId).subscribe(products => {
      this.hostedProducts = products.items;
      this.productPaginationMeta = products.meta;
      this.productPaginationMeta.paginationId = 'profile-hosted-products'
    });
  }

  pageChanged(page: number) {
    this.currentPage = page;
    this.getHostedProducts(page, this.profileUser.id);
  }

  onPage(event) {
    this.getReviews(event);
  }

  back() {
    this.location.back();
  }
}
