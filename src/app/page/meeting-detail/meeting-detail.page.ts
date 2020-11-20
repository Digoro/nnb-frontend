import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ToastController } from '@ionic/angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'ngx-clipboard';
import { Meeting } from 'src/app/model/meeting';
import { MeetingService } from 'src/app/service/meeting.service';
import { environment } from './../../../environments/environment';
import { Category } from './../../model/category';
import { Comment } from './../../model/comment';
import { User } from './../../model/user';
import { AuthService } from './../../service/auth.service';
import { CheckDesktopService } from './../../service/check-desktop.service';
import { CommentService } from './../../service/comment.service';
import { TimeUtilService } from './../../service/time-util.service';
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
  quillStyle;
  meeting: Meeting;
  host: User;
  user: User;

  comments: Comment[];

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
  selectedMeeting: Meeting;

  isDesktop = true;
  runningHours;
  runningMinutes;
  categories;

  requestNumber = 0;
  isRequestedMeeting: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private meetingService: MeetingService,
    private userService: UserService,
    private location: Location,
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
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.user = user;
      this.quillStyle = this.utilService.getQuillStyle();
      this.route.params.subscribe(params => {
        const id = params.id;
        this.meetingService.getMeeting(id).subscribe(meeting => {
          this.meetingService.getRequestMeeting(id).subscribe(requestMeetings => {
            if (requestMeetings.length > 0) {
              this.requestNumber = requestMeetings.map(m => m.peopleNumber).reduce((a, b) => a + b);
            }
            if (!!this.user) {
              this.isRequestedMeeting = !!requestMeetings.find(m => m.user['uid'] === this.user.uid);
            } else {
              this.isRequestedMeeting = false;
            }
            const title = `[노는법] ${meeting.title}`
            this.titleService.setTitle(title);
            this.meeting = meeting;
            this.userService.get(this.meeting.host).subscribe(user => {
              this.host = user;
            });
            this.runningHours = Math.floor(meeting.runningMinutes / 60);
            this.runningMinutes = meeting.runningMinutes % 60;
            this.categories = Category[meeting.categories]
            this.getComments();
          })
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

  private getComments() {
    this.commentService.getCommentsByMeeting(this.meeting.mid).subscribe(comments => {
      this.comments = comments;
    });
  }

  onDeleteComment(event) {
    const isParent = event.isParent
    const comment = event.comment;
    this.commentService.delete(isParent, comment).subscribe(resp => {
      this.getComments();
    })
  }

  needLogin() {
    this.authService.toastNeedLogin();
  }

  openModal(meeting: Meeting, template: TemplateRef<any>) {
    const config = {
      class: 'modal-dialog-centered',
      animated: false
    }
    this.selectedMeeting = meeting;
    this.modalRef = this.modalService.show(template, config);
  }

  share(sns: string) {
    let currentUrl = `https://nonunbub.com/tabs/meeting-detail/${this.meeting.mid}`
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
          this.selectedMeeting.file,
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


  like(meeting: Meeting) {
    alert('서비스 준비중입니다 ^^');
  }

  onComment(value) {
    const comment = new Comment(0, this.meeting.mid, this.user.uid, 0, value, TimeUtilService.getNow())
    this.commentService.comment(comment).subscribe(resp => {
      this.getComments();
    })
  }

  onChildComment(event) {
    const value = event.value;
    const parentCid = event.parentCid;
    const comment = new Comment(0, this.meeting.mid, this.user.uid, 0, value, TimeUtilService.getNow(), parentCid)
    this.commentService.comment(comment).subscribe(resp => {
      this.getComments();
    })
  }

  back() {
    this.location.back();
  }
}
