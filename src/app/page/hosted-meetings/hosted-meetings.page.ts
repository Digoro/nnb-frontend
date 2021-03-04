import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Product, ProductStatus } from 'src/app/model/product';
import { User } from 'src/app/model/user';
import { CheckDesktopService } from 'src/app/service/check-desktop.service';
import { ProductService } from 'src/app/service/meeting.service';
import { PaginationMeta } from './../../model/pagination';
import { AuthService } from './../../service/auth.service';
import { PaymentService } from './../../service/payment.service';

@Component({
  selector: 'hosted-meetings',
  templateUrl: './hosted-meetings.page.html',
  styleUrls: ['./hosted-meetings.page.scss'],
})
export class HostedMeetingsPage implements OnInit {
  host: User;
  hostedProducts: Product[];
  isDesktop = false;
  meta: PaginationMeta;
  currentPage = 1;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private cds: CheckDesktopService,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.cds.isDesktop.subscribe(resp => this.isDesktop = resp)
    this.authService.getCurrentNonunbubUser().subscribe(resp => {
      this.host = resp;
      this.getHostedProducts(1, this.host.id);
    })
  }

  private getHostedProducts(page: number, hostId: number) {
    this.productService.getHostedProducts(page, 10, ProductStatus.ALL, hostId).subscribe(products => {
      this.hostedProducts = products.items;
      this.meta = products.meta;
      this.meta.paginationId = 'hosted-products'
    });
  }

  pageChanged(page: number) {
    this.currentPage = page;
    this.getHostedProducts(page, this.host.id);
  }

  getStatusLabel(status) {
    return this.productService.getStatusLabel(status);
  }

  segmentChanged(event) {
    console.log(event);
  }

  edit(id: number) {
    this.router.navigate(['/host/meeting-management/meeting-edit', id])
  }

  removeProduct(id: number) {
    const isDelete = confirm('정말로 삭제하시겠습니까?');
    if (isDelete) {
      this.paymentService.getPaymentsCountByProduct(id).subscribe(resp => {
        if (resp > 0) {
          this.productService.manageProduct(id, { status: ProductStatus.DISABLED }).subscribe(resp => {
            alert('결제한 고객이 있어 모임을 삭제 하지않고 비활성하였습니다.');
            this.getHostedProducts(this.currentPage, this.host.id);
          })
        } else {
          this.productService.deleteProduct(id).subscribe(resp => {
            alert('모임을 삭제하였습니다.');
            this.getHostedProducts(1, this.host.id);
          })
        }
      })
    }
  }

  noReady() {
    alert('서비스 준비중')
  }

  async presentActionSheet(id: number) {
    const actionSheet = await this.actionSheetController.create({
      header: '모임',
      buttons: [{
        text: '수정 하기',
        icon: '',
        handler: () => {
          this.edit(id);
        }
      }, {
        text: '삭제',
        role: 'destructive',
        icon: '',
        handler: () => {
          this.removeProduct(id);
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
