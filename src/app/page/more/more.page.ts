import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { UtilService } from 'src/app/service/util.service';
import { environment } from './../../../environments/environment';
import { MoreMenuGroup, MoreMenuItem } from './../../model/more-menu';
import { KakaoUser } from './../../model/user';
declare var Kakao;

@Component({
  selector: 'more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {
  user: User;
  kakaoUser: KakaoUser;
  menus: MoreMenuGroup[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private utilService: UtilService,
  ) {
    this.utilService.loadScript('https://developers.kakao.com/sdk/js/kakao.js')
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(resp => {
      this.user = resp.user;
      this.kakaoUser = resp.kakaoUser;
      this.menus = [
        new MoreMenuGroup('계정 관리', [
          new MoreMenuItem('개인정보 관리', () => alert('서비스 준비중입니다 ^^'), 'person-circle-outline', true),
          new MoreMenuItem('간편결제 관리', () => {
            // alert('서비스 준비중입니다 ^^');
            this.router.navigate(['/tabs/payment-management'])
          }, 'card-outline'),
          new MoreMenuItem('정산계좌 관리', () => alert('서비스 준비중입니다 ^^'), 'cash-outline', true)
        ]),
        new MoreMenuGroup('모임 관리', [
          new MoreMenuItem('모임 만들기', () => this.router.navigate(['/tabs/meeting-add']), 'add-outline'),
          new MoreMenuItem('주최한 모임 관리', () => this.router.navigate(['/tabs/my-meetings']), 'copy-outline'),
          new MoreMenuItem('예약 관리', () => alert('서비스 준비중입니다 ^^'), 'time-outline', true),
          new MoreMenuItem('문의사항 관리', () => alert('서비스 준비중입니다 ^^'), 'help-circle-outline', true),
          new MoreMenuItem('후기 관리', () => alert('서비스 준비중입니다 ^^'), 'chatbubble-ellipses-outline', true),
          new MoreMenuItem('정산 관리', () => alert('서비스 준비중입니다 ^^'), 'wallet-outline', true)
        ]),
        new MoreMenuGroup('지원', [
          new MoreMenuItem('이벤트', () => this.router.navigate(['/tabs/event']), ''),
          new MoreMenuItem('서비스 소개', () => window.open('https://www.notion.so/gdgdaejeon/f381a7c4327a4ddb9095dd6b0cdd00c9'), ''),
          new MoreMenuItem('매거진', () => this.router.navigate(['/tabs/magazine']), ''),
          new MoreMenuItem('공지사항', () => alert('서비스 준비중입니다 ^^'), '', true),
          new MoreMenuItem('이용약관', () => window.open('https://www.notion.so/gdgdaejeon/99e6bfa922f64cfea1e24c5d000d829e'), ''),
          new MoreMenuItem('사업자 정보', () => window.open('http://www.ftc.go.kr/bizCommPop.do?wrkr_no=3938701601&apv_perm_no='), ''),
          new MoreMenuItem('자주 묻는 질문', () => alert('서비스 준비중입니다 ^^'), '', true),
          new MoreMenuItem('문의 하기', () => window.open('mailto:nonunbub@gmail.com'), ''),
          new MoreMenuItem('회원탈퇴', () => alert('서비스 준비중입니다 ^^'), '', true, !!this.user)
        ])
      ]
    });
  }

  editUser() {
    alert('서비스 준비중입니다 ^^')
    // this.router.navigate(['/tabs/edit-profile']);
  }

  login(method: string) {
    if (method === 'kakao') {
      if (!Kakao.isInitialized()) {
        Kakao.init(environment.KAKAO_AUTH_KEY);      // 사용할 앱의 JavaScript 키를 설정
      }
      Kakao.Auth.authorize({
        redirectUri: 'http://nonunbub.com/accounts/kakao/login/callback/',
      });
    } else if (method === 'email') {
      alert('서비스 준비중입니다 ^^');
    }
  }

  logout() {
    this.authService.logout().subscribe(resp => {
      this.user = undefined;
      this.router.navigate(['/tabs/home']);
    }, error => {
      console.log(error);
    });
  }
}
