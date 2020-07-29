import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { User } from 'src/app/model/user';
import { Magazine } from './../../model/magazine';
import { AuthService } from './../../service/auth.service';
import { MagazineService } from './../../service/magazine.service';

@Component({
  selector: 'magazine',
  templateUrl: './magazine.page.html',
  styleUrls: ['./magazine.page.scss'],
})
export class MagazinePage implements OnInit {
  currentUser: User;
  magazines: Magazine[];
  isAdmin = false;

  constructor(
    private magazineService: MagazineService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.currentUser = user;
      if (user.uid === this.authService.ADMIN_ID) this.isAdmin = true;
      else this.isAdmin = false;
    })
  }

  ionViewDidEnter() {
    this.setMagazines();
  }

  setMagazines() {
    this.magazineService.getList().subscribe(resp => {
      this.magazines = resp;
    })
  }

  goDetailPage(mid: number) {
    this.router.navigate(['/tabs/magazine-detail', mid])
  }

  async presentActionSheet(mid: number) {
    const actionSheet = await this.actionSheetController.create({
      header: '매거진',
      buttons: [{
        text: '수정',
        icon: '',
        handler: () => {
          this.router.navigate(['./tabs/magazine-edit', mid])
        }
      }, {
        text: '삭제',
        role: 'destructive',
        icon: '',
        handler: () => {
          const isDelete = confirm('정말로 삭제하시겠습니까?');
          if (isDelete) {
            this.magazineService.delete(mid).subscribe(resp => {
              alert('매거진을 삭제하였습니다.');
              this.setMagazines();
            })
          }
        }
      }, {
        text: '취소',
        icon: '',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
