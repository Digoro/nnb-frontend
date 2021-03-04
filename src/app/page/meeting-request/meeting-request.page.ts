import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductRequestCreateDto } from 'src/app/model/product';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { FormService } from 'src/app/service/form.service';
import { ProductService } from 'src/app/service/meeting.service';

@Component({
  selector: 'meeting-request',
  templateUrl: './meeting-request.page.html',
  styleUrls: ['./meeting-request.page.scss'],
})
export class MeetingRequestPage implements OnInit {
  user: User;
  id: number;
  product: Product;
  form: FormGroup;
  isRequestedProduct: boolean = false;
  phoneNumber: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      numberOfPeople: new FormControl('', this.formService.getValidators(2, [Validators.min(1), Validators.max(99)])),
      message: new FormControl('', this.formService.getValidators(500)),
    });
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.route.params.subscribe(params => {
        this.id = +params.id;
        this.productService.getProduct(this.id).subscribe(product => {
          this.product = product;
          this.user = user;
          if (this.user.phoneNumber) this.phoneNumber = this.user.phoneNumber;
          this.productService.isChecked(this.id).subscribe(resp => {
            this.isRequestedProduct = resp;
          })
        })
      })
    });
  }

  onAddPhone(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
  }

  request() {
    const { numberOfPeople, message } = this.form.value;
    const requestProduct = new ProductRequestCreateDto(this.id, +numberOfPeople, message, false);
    this.productService.requestProduct(requestProduct).subscribe(resp => {
      alert('신청되었습니다. 신청인원이 확보되면 작성하신 휴대폰 번호로 안내드릴게요!');
      this.router.navigate(['/tabs/meeting-detail', this.id]);
    })
  }
}
