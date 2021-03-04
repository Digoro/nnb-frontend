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
  currentPage: number;
  nextPage: number;

  constructor(
    private magazineService: MagazineService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.currentUser = user;
      if (user.id === this.authService.ADMIN_ID) this.isAdmin = true;
      else this.isAdmin = false;
    })
  }

  ionViewDidEnter() {
    this.setMagazines();
  }

  setMagazines() {
    this.magazineService.getList(1).subscribe(resp => {
      this.magazines = resp.items;
      this.setPagination(resp.meta);
    })
  }

  goDetailPage(id: number) {
    this.router.navigate(['/tabs/magazine-detail', id])
  }

  async presentActionSheet(id: number) {
    const actionSheet = await this.actionSheetController.create({
      header: '매거진',
      buttons: [{
        text: '수정',
        icon: '',
        handler: () => {
          this.router.navigate(['./tabs/magazine-edit', id])
        }
      }, {
        text: '삭제',
        role: 'destructive',
        icon: '',
        handler: () => {
          const isDelete = confirm('정말로 삭제하시겠습니까?');
          if (isDelete) {
            this.magazineService.delete(id).subscribe(resp => {
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

  private setPagination(meta) {
    this.currentPage = +meta.currentPage;
    const lastPage = +meta.totalPages;
    if (this.currentPage + 1 <= lastPage) {
      this.nextPage = this.currentPage + 1;
    }
  }

  loadData(event) {
    if (this.currentPage < this.nextPage) {
      this.magazineService.getList(+this.nextPage).subscribe(resp => {
        this.magazines = [...this.magazines, ...resp.items];
        this.setPagination(resp.meta);
        event.target.complete();
      })
    } else event.target.disabled = true;
  }
}
