import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { IonTextarea } from '@ionic/angular';
import { ProductReview } from 'src/app/model/comment';
import { PaginationMeta } from 'src/app/model/pagination';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { CommentService } from './../../service/comment.service';

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnChanges {
  @Input() reviews: ProductReview[];
  @Input() currentUser: User;
  @Input() editable = true;
  @Input() displayLabel = false;
  @Input() meta: PaginationMeta;
  @Output() onComment = new EventEmitter();
  @Output() onChildComment = new EventEmitter();
  @Output() onPage = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @ViewChild('comment') comment: IonTextarea;
  canWrite = true;
  commentInput: string;
  childCommentInput: string;
  @ViewChildren('addChildInput') addChildInputs: QueryList<ElementRef>
  DELETE_FLAG;

  constructor(
    private authService: AuthService,
    private renderer: Renderer2
  ) { this.DELETE_FLAG = CommentService.DELETE_FLAG }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.reviews) {
      if (!changes.reviews.firstChange && !!changes.reviews.currentValue) {
        this.reviews.map(review => {
          if (!!this.currentUser) {
            if (review.user.id === this.currentUser.id) review.canDelete = true;
          }
          return review;
        })
        let parents = this.reviews.filter(review => !review.parent);
        let children = this.reviews.filter(review => !!review.parent);
        this.reviews = parents.map(parent => {
          parent.children = children.filter(child => child.parent.id === parent.id)
          return parent;
        })
      }
    }
    if (!!changes.currentUser) {
      if (changes.currentUser && !changes.currentUser.currentValue) {
        this.canWrite = false;
      }
    }
  }

  ngOnInit() { }

  onInput(event) {
    const obj = event.target;
    obj.style.height = "1px";
    obj.style.height = (2 + obj.scrollHeight) + "px";
  }

  deleteComment(review: ProductReview) {
    this.onDelete.emit(review);
  }

  private resetChildInput() {
    this.addChildInputs.forEach(input => {
      this.renderer.setStyle(input.nativeElement, 'display', 'none');
      input.nativeElement.children[0].children[0].value = '';
    })
  }

  showChildComment(index: number, parentReview: ProductReview) {
    this.resetChildInput();
    const selected = this.addChildInputs.find((element, i) => i === index);
    this.renderer.setStyle(selected.nativeElement, 'display', 'block');
  }

  needLogin() {
    this.authService.toastNeedLogin();
  }

  ok() {
    const value = this.comment.value;
    if (!!value) {
      this.onComment.emit(value);
      this.commentInput = '';
    }
  }

  okChild(index: number, parentComment: ProductReview) {
    const selected = this.addChildInputs.find((element, i) => i === index);
    const value = selected.nativeElement.children[0].children[0].value;
    if (!!value) {
      this.onChildComment.emit({ value, parentCid: parentComment.id });
      this.resetChildInput();
    }
  }

  pageChanged(event) {
    this.onPage.emit(event);
  }
}
