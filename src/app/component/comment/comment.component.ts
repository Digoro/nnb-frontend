import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { IonTextarea } from '@ionic/angular';
import { Comment } from 'src/app/model/comment';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { CommentService } from './../../service/comment.service';

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnChanges {
  @Input() comments: Comment[];
  @Input() currentUser: User;
  @Input() editable = true;
  @Input() displayLabel = false;
  @Output() onComment = new EventEmitter();
  @Output() onChildComment = new EventEmitter();
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
    if (!!changes.comments) {
      if (!changes.comments.firstChange && !!changes.comments.currentValue) {
        this.comments.map(comment => {
          if (!!this.currentUser) {
            if (comment['writer']['uid'] === this.currentUser.uid) comment.canDelete = true;
          }
          return comment;
        })
        let parents = this.comments.filter(comment => comment.parentCid === 0);
        let children = this.comments.filter(comment => comment.parentCid !== 0);
        this.comments = parents.map(parent => {
          parent.children = children.filter(child => child.parentCid === parent.cid)
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

  delete(isParent: boolean, comment: Comment) {
    this.onDelete.emit({ isParent, comment });
  }

  private resetChildInput() {
    this.addChildInputs.forEach(input => {
      this.renderer.setStyle(input.nativeElement, 'display', 'none');
      input.nativeElement.children[0].children[0].value = '';
    })
  }

  showChildComment(index: number, parentComment: Comment) {
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

  okChild(index: number, parentComment: Comment) {
    const selected = this.addChildInputs.find((element, i) => i === index);
    const value = selected.nativeElement.children[0].children[0].value;
    if (!!value) {
      this.onChildComment.emit({ value, parentCid: parentComment.cid });
      this.resetChildInput();
    }
  }
}
