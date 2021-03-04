import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ToastController } from '@ionic/angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'ngx-clipboard';
import { PaginationMeta } from 'src/app/model/pagination';
import { Product, ProductStatus } from 'src/app/model/product';
import { ProductService } from 'src/app/service/meeting.service';
import { environment } from './../../../environments/environment';
import { ProductReview, ProductReviewCreateDto } from './../../model/comment';
import { User } from './../../model/user';
import { AuthService } from './../../service/auth.service';
import { CheckDesktopService } from './../../service/check-desktop.service';
import { CommentService } from './../../service/comment.service';
import { TitleService } from './../../service/title.service';
import { UserService } from './../../service/user.service';
import { UtilService } from './../../service/util.service';
declare var Kakao;

@Component({
  selector: 'meeting-detail',
  templateUrl: './meeting-detail.page.html',
  styleUrls: ['./meeting-detail.page.scss'],
})
export class MeetingDetailPage implements OnInit {
  paramId: number;
  quillStyle;
  product: Product;
  ProductStatus = ProductStatus;
  host: User;
  user: User;

  reviews: ProductReview[];
  meta: PaginationMeta;
  currentReviewPage = 1;

  options: NativeTransitionOptions = {
    direction: 'right',
    duration: 500,
    slowdownfactor: 1,
    slidePixels: 20,
    iosdelay: 100,
    androiddelay: 150,
    fixedPixelsTop: 0,
    fixedPixelsBottom: 60
  };

  modalRef: BsModalRef;
  selectedMeeting: Product;

  isDesktop = true;
  runningHours;
  runningMinutes;
  categories;

  requestNumber = 0;
  alreadyRequestProduct: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private clipboardService: ClipboardService,
    private utilService: UtilService,
    private toastController: ToastController,
    private modalService: BsModalService,
    private commentService: CommentService,
    private authService: AuthService,
    public cds: CheckDesktopService,
    private titleService: TitleService,
  ) {
    this.utilService.loadScript('https://developers.kakao.com/sdk/js/kakao.js')
  }

  ngOnInit() {
    this.cds.isDesktop.subscribe(resp => this.isDesktop = resp)
    this.quillStyle = this.utilService.getQuillStyle();
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.user = user;
      this.route.params.subscribe(params => {
        this.paramId = params.id;
        this.productService.getProduct(this.paramId, this.user?.id).subscribe(product => {
          const title = `[노는법] ${product.title}`
          this.product = product;
          this.titleService.setTitle(title);
          if (product.productRequests.length > 0) {
            this.requestNumber = product.productRequests.map(m => m.numberOfPeople).reduce((a, b) => a + b);
          }
          this.alreadyRequestProduct = !!this.user && !!product.productRequests.find(m => m.user['id'] === this.user.id);
          this.runningHours = Math.floor(product.runningMinutes / 60);
          this.runningMinutes = product.runningMinutes % 60;
          this.getComments(this.currentReviewPage);
          this.userService.get(this.product.host.id).subscribe(host => this.host = host);
        }, error => {
          if ((error as HttpErrorResponse).status === 404) {
            alert('모임이 존재하지 않습니다.');
            this.router.navigate(['/tabs/home']);
          }
        });
      });
    });
  }

  setPosition(id) {
    document.getElementById(`section-${id}`).scrollIntoView(true);
  }

  onScroll(event) {
    const currentScrollDepth = event.detail.scrollTop + 60;
    document.querySelectorAll(".menu a").forEach(link => {
      let sectionId = (link.classList[0]).match(/section-\d/g)[0];
      const section = document.getElementById(sectionId);
      if (section.offsetTop <= currentScrollDepth && section.offsetTop + section.offsetHeight > currentScrollDepth) {
        link.classList.add("current");
      } else {
        link.classList.remove("current");
      }
    });
  }

  onShowAll(key: string, title: string) {
    this.router.navigate(['./tabs/meetings'], { queryParams: { key, title } });
  }

  private getComments(page: number) {
    this.commentService.getCommentsByMeeting(this.product.id, page).subscribe(comments => {
      this.reviews = comments.items;
      this.meta = comments.meta;
      this.meta.paginationId = 'meeting-detail';
    });
  }

  onDeleteComment(event) {
    this.commentService.delete(event).subscribe(resp => {
      this.getComments(this.currentReviewPage);
    })
  }

  needLogin() {
    this.authService.toastNeedLogin();
  }

  openModal(meeting: Product, template: TemplateRef<any>) {
    const config = {
      class: 'modal-dialog-centered',
      animated: false
    }
    this.selectedMeeting = meeting;
    this.modalRef = this.modalService.show(template, config);
  }

  share(sns: string) {
    let currentUrl = `https://nonunbub.com/tabs/meeting-detail/${this.product.id}`
    switch (sns) {
      case 'facebook': {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, 'facebook-popup', 'height=350,width=600');
        return false;
      }
      case 'kakaotalk': {
        this.shareKakaotalk(currentUrl)
        return false;
      }
      case 'kakaostory': {
        Kakao.Story.share({
          url: currentUrl,
          text: ''
        });
        return false;
      }
      case 'naverband': {
        window.open(`https://band.us/plugin/share?body=${currentUrl}`, 'facebook-popup', 'height=350,width=600')
        return false;
      }
      case 'link': {
        this.modalRef.hide();
        this.clipboardService.copyFromContent(currentUrl);
        this.toastPasteLink();
        return false;
      }
    }
  }

  shareKakaotalk(url: string) {
    const config = {
      objectType: 'feed',
      content: {
        title: '노는법',
        description: this.selectedMeeting.title,
        imageUrl:
          this.selectedMeeting.representationPhotos[0].photo,
        link: {
          mobileWebUrl: url,
          androidExecParams: 'test',
        },
      },
      success: function (response) {
        console.log(response);
      },
      fail: function (error) {
        console.log(error);
      }
    }
    if (!Kakao.isInitialized()) {
      Kakao.init(environment.KAKAO_AUTH_KEY);      // 사용할 앱의 JavaScript 키를 설정
    }
    Kakao.Link.sendDefault(config);
  }

  async toastPasteLink() {
    const toast = await this.toastController.create({
      header: '노는법',
      duration: 2000,
      message: '주소가 복사되었습니다!',
      animated: true,
      position: 'bottom',
    });
    toast.present();
  }

  question() {
    window.open('https://nonunbub.channel.io');
  }


  like(id: number, isLike: boolean) {
    if (!this.user) {
      this.router.navigate(['/tabs/login'], { queryParams: { returnUrl: this.router.url } });
    } else {
      this.userService.likeProduct(id, isLike).subscribe(resp => {
        this.productService.getProduct(this.paramId, this.user.id).subscribe(resp => {
          this.product = resp;
          if (isLike) alert('찜하였습니다!');
        })
      })
    }
  }

  onComment(value) {
    const comment = new ProductReviewCreateDto(this.product.id, 0, value)
    this.commentService.comment(comment).subscribe(resp => {
      this.getComments(this.currentReviewPage);
    })
  }

  onChildComment(event) {
    const value = event.value;
    const parentCid = event.parentCid;
    const comment = new ProductReviewCreateDto(this.product.id, 0, value, undefined, parentCid)
    this.commentService.comment(comment).subscribe(resp => {
      this.getComments(this.currentReviewPage);
    })
  }

  onPage(event) {
    this.getComments(event);
  }
}
