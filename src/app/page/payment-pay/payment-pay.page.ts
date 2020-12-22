import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { PayMethod } from 'src/app/model/payment-user-info';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { Coupon } from '../../model/coupon';
import { Meeting } from '../../model/meeting';
import { CouponService } from '../../service/coupon.service';
import { MeetingService } from '../../service/meeting.service';
import { PaymentService } from '../../service/payment.service';

@Component({
  selector: 'payment-pay',
  templateUrl: './payment-pay.page.html',
  styleUrls: ['./payment-pay.page.scss'],
})
export class PaymentPayPage implements OnInit {
  user: User;
  meeting: Meeting;
  isThan: boolean;
  isThanPrice = 10000;
  price: number;
  form: FormGroup;
  options: any[];
  coupons: Coupon[]
  selectedCoupon: Coupon;
  phone: string;
  alreadyExistPhone = false;

  constructor(
    private route: ActivatedRoute,
    private meetingService: MeetingService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private fb: FormBuilder,
    private couponService: CouponService
  ) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.form = this.fb.group({
      coupon: new FormControl(false),
      payMethod: new FormControl('', Validators.required)
    })
  }

  ionViewDidEnter() {
    this.initForm()
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.user = user;
      if (this.user.phone) {
        this.phone = this.user.phone;
        this.alreadyExistPhone = true;
      }
      const params: {
        mid: number, options: {
          oid: number,
          optionCount: number,
          optionDate: string,
          optionPrice: number
          optionTitle
        }[]
      } = JSON.parse(this.route.snapshot.params.queryParams);
      const mid = params.mid;
      this.options = params.options;
      this.setPrice();
      this.meetingService.getMeeting(mid).subscribe(meeting => {
        this.meeting = meeting;
        this.couponService.getCoupons(user.uid, false).subscribe(coupons => {
          this.coupons = coupons;
        })
      });
    })
  }

  setPrice() {
    if (this.options.length > 0) {
      this.price = this.options.map(option => option.optionPrice * +option.optionCount).reduce((a, b) => a + b);
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
      o.optionDate = moment(o.optionDate).format('YYYYMMDDHHmmss')
      return o
    })
    let method;
    let isOk = true;
    switch (payMethod) {
      case 'card': method = PayMethod.CARD; break;
      case 'transfer': method = PayMethod.TRANSFER; break;
    }
    if (isOk) this.paymentService.pay(method, this.user, this.meeting, this.phone, this.price, optionsTemp, coupon);
  }

  onAddPhone(phone) {
    this.phone = phone;
  }

  ionViewDidLeave() {
    this.form.reset();
  }
}