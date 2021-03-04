import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { PayMethod } from 'src/app/model/payment';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { Coupon } from '../../model/coupon';
import { Product, ProductStatus } from '../../model/product';
import { CouponService } from '../../service/coupon.service';
import { ProductService } from '../../service/meeting.service';
import { PaymentService } from '../../service/payment.service';
import { FormService } from './../../service/form.service';
import { UserService } from './../../service/user.service';

@Component({
  selector: 'payment-pay',
  templateUrl: './payment-pay.page.html',
  styleUrls: ['./payment-pay.page.scss'],
})
export class PaymentPayPage implements OnInit {
  user: User;
  meeting: Product;
  ProductStatus = ProductStatus;
  isThan: boolean;
  isThanPrice = 10000;
  price: number;
  form: FormGroup;
  options: any[];
  coupons: Coupon[]
  selectedCoupon: Coupon;
  phoneNumber: string;
  alreadyExistPhone = false;
  alreadyExistName = false;

  constructor(
    private route: ActivatedRoute,
    private meetingService: ProductService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private fb: FormBuilder,
    private couponService: CouponService,
    private formSerivce: FormService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      coupon: new FormControl(false),
      name: new FormControl('', this.formSerivce.getValidators(30)),
      payMethod: new FormControl('', Validators.required)
    })
  }

  ionViewDidEnter() {
    this.initForm();
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.user = user;
      if (this.user.phoneNumber) {
        this.phoneNumber = this.user.phoneNumber;
        this.alreadyExistPhone = true;
      }
      if (this.user.name) {
        this.form.controls.name.setValue(this.user.name);
        this.alreadyExistName = true;
      }
      const params: {
        id: number, options: {
          id: number,
          count: number,
          date: string,
          price: number,
          discountPrice: number,
          name,
          description
        }[]
      } = JSON.parse(this.route.snapshot.params.queryParams);
      const id = params.id;
      this.options = params.options;
      this.setPrice();
      this.meetingService.getProduct(id).subscribe(meeting => {
        this.meeting = meeting;
        this.couponService.search({ page: 1, limit: 10, userId: this.user.id, expireDuration: new Date(), isUsed: false }).subscribe(coupons => {
          this.coupons = coupons.items;
        })
      });
    })
  }

  setPrice() {
    if (this.options.length > 0) {
      this.price = this.options.map(option => option.price * +option.count).reduce((a, b) => a + b);
      this.isThan = this.price < this.isThanPrice;
      if (this.isThan) {
        this.form.controls.coupon.patchValue(false);
        this.selectedCoupon = undefined;
      }
      if (this.selectedCoupon) {
        const result = this.price - this.selectedCoupon.price;
        if (result < 0) {
          alert('할인 금액이 더 큽니다. 적용한 포인트/쿠폰의 남은 금액은 결제 시 남지 않고 소멸됩니다.')
          this.price = 0
        }
        else this.price = result
      }
    } else {
      this.price = 0;
    }
  }

  selectCoupon(event) {
    this.selectedCoupon = event.target.value;
    this.setPrice();
  }

  pay() {
    const { coupon, payMethod } = this.form.value;
    let optionsTemp = this.options.map(o => {
      o.date = moment(o.date).format('YYYYMMDDHHmmss')
      return o
    })
    let method;
    switch (payMethod) {
      case 'card': method = PayMethod.CARD; break;
      case 'transfer': method = PayMethod.TRANSFER; break;
    }
    this.paymentService.pay(method, this.user, this.meeting, this.phoneNumber, this.price, optionsTemp, coupon);
    this.userService.edit(this.user.id, undefined, undefined, this.form.controls.name.value).subscribe(resp => {
      console.log(resp);
    })
  }

  onAddPhone(phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  ionViewDidLeave() {
    this.form.reset();
  }
}