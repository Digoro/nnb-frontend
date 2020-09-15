import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarComponentOptions, CalendarDay } from 'ion2-calendar';
import * as moment from 'moment';
import { PaymentResult } from 'src/app/model/payment';
import { PayMethod, UserPaymentInfo } from 'src/app/model/payment-user-info';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { FormService } from 'src/app/service/form.service';
import { Coupon } from './../../model/coupon';
import { Meeting, MeetingOption } from './../../model/meeting';
import { CouponService } from './../../service/coupon.service';
import { MeetingService } from './../../service/meeting.service';
import { PaymentService } from './../../service/payment.service';

@Component({
  selector: 'payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  user: User;
  meeting: Meeting;
  paymentMethod: string;
  accounts: UserPaymentInfo[];
  isThan: boolean;
  isThanPrice = 10000;
  price: number;
  isSimple = false;
  selectedPayerId: string;
  form: FormGroup;
  isFree = true;
  options: FormArray;
  coupons: Coupon[]
  selectedCoupon: Coupon;
  selectedOptionsFromCalendar: MeetingOption[];
  selectedOptionsFromCheckbox: MeetingOption[] = [];
  calendarOptions: CalendarComponentOptions;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private formService: FormService,
    private fb: FormBuilder,
    private couponService: CouponService
  ) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.form = this.fb.group({
      options: this.fb.array([], Validators.required),
      phone: new FormControl('', this.formService.getValidators(30, [Validators.pattern("[0-9 ]{11}")])),
      coupon: new FormControl(false),
      date: new FormControl('')
    })
  }

  ionViewDidEnter() {
    this.initForm()
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.user = user;
      this.paymentService.getUserPaymentAccounts(this.user.uid).subscribe(accounts => {
        this.accounts = accounts;
        this.route.params.subscribe(params => {
          const mid = params.mid;
          this.meetingService.getMeeting(mid).subscribe(meeting => {
            meeting.options = meeting.options.map((option, i) => {
              option['formGroupName'] = i;
              return option;
            })
            this.meeting = meeting;
            this.selectedOptionsFromCalendar = meeting.options;
            this.calendarOptions = {
              color: 'primary',
              to: null,
              monthFormat: 'YYYY.MM',
              weekdays: ['일', '월', '화', '수', '목', '금', '토'],
              monthPickerFormat: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
              daysConfig: this.meeting.options.map(option => {
                return {
                  date: moment(option.optionTo).toDate(),
                  marked: true,
                  disable: false,
                  // title: option.optionTitle,
                  // subTitle: `${option.optionPrice}`,
                  cssClass: '',
                }
              })
            }
            this.isFree = this.meeting.price === 0;
            this.couponService.getCoupons(user.uid, false).subscribe(coupons => {
              this.coupons = coupons;
            })
          });
        })
      })
    })
  }

  selectedMonth: number;
  selectedDay: number;
  isSameSelectDate = true;

  showAllOptions() {
    this.selectedOptionsFromCalendar = this.meeting.options;
    this.isSameSelectDate = false;
    this.setSelectCheckbox();
  }

  selectCalendar(event: CalendarDay) {
    const month = +moment(event.time).format('M')
    const day = +moment(event.time).get('D')

    // select same date
    if (this.selectedMonth === month && this.selectedDay === day && this.isSameSelectDate) {
      this.selectedOptionsFromCalendar = this.meeting.options;
      this.isSameSelectDate = false;
    }
    // select calendar date
    else {
      const selectedOptions = this.meeting.options.filter(option => {
        const optionMonth = +moment(option.optionTo).format('M');
        const optionDay = +moment(option.optionTo).format('D');
        return month === optionMonth && day === optionDay;
      })
      this.selectedOptionsFromCalendar = selectedOptions;
      this.selectedMonth = month;
      this.selectedDay = day;
      this.isSameSelectDate = true;
    }
    this.setSelectCheckbox();
  }

  setSelectCheckbox() {
    this.selectedOptionsFromCalendar = this.selectedOptionsFromCalendar.map(calendar => {
      const isSame = this.selectedOptionsFromCheckbox.find(checkbox => checkbox.oid === calendar.oid);
      calendar['checked'] = isSame
      return calendar;
    })
  }

  addAccount() {
    this.router.navigate(['/tabs/payment-management'])
  }

  selectPaymentMethod(event) {
    this.paymentMethod = event.target.value;
    if (this.paymentMethod === 'simple') this.isSimple = true;
    else {
      this.isSimple = false;
      this.selectedPayerId = undefined;
    }
  }

  setPrice() {
    if (this.options.value.length > 0) {
      this.price = this.options.value.map(option => option.optionPrice * +option.optionCount).reduce((a, b) => a + b);
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

  changeCount(flag: boolean, index: number) {
    const control = this.options.at(index)['controls'].optionCount;
    const value = control.value;
    if (flag) {
      if (value > 998) return;
      control.setValue(value + 1);
    }
    else {
      if (value < 2) return;
      control.setValue(value - 1);
    }
    this.setPrice()
  }

  selectMeetingOption(event, option: MeetingOption) {
    if (event.detail.checked) {
      this.addItem(option);
      this.selectedOptionsFromCheckbox.push(option);
    }
    else {
      this.minusItem(option)
      this.selectedOptionsFromCheckbox = this.selectedOptionsFromCheckbox.filter(o => o.oid === option.oid);
    }
    this.setPrice()
    this.options.controls = this.sortSelectedOptions(this.options.controls)
  }

  createItem(option: MeetingOption) {
    return this.fb.group({
      oid: [option.oid, Validators.required],
      optionTitle: [option.optionTitle, Validators.required],
      optionPrice: [option.optionPrice, Validators.required],
      optionCount: [1, this.formService.getValidators(10, [Validators.min(1), Validators.max(999)])],
      optionTo: [option.optionTo]
    });
  }

  addItem(option: MeetingOption): void {
    this.options = this.form.get('options') as FormArray;
    this.options.push(this.createItem(option));
  }

  minusItem(option: MeetingOption): void {
    this.options = this.form.get('options') as FormArray;
    const value = this.options.value.find(o => o.oid === option.oid)
    const index = this.options.value.indexOf(value)
    this.options.removeAt(index);
  }

  sortSelectedOptions(controls: AbstractControl[]) {
    return controls.sort((a, b) => {
      if (moment(a.value.optionTo).isBefore(b.value.optionTo)) return -1;
      else if (moment(a.value.optionTo).isSame(b.value.optionTo)) return 0;
      else return 1;
    })
  }

  pay() {
    const { phone, options, coupon } = this.form.value;
    let method, selectedAccount;
    switch (this.paymentMethod) {
      case 'card': method = PayMethod.CARD; break;
      case 'transfer': method = PayMethod.TRANSFER; break;
      case 'simple': {
        method = PayMethod.SIMPLE_TRANSFER;
        selectedAccount = this.accounts.find(a => a.PCD_PAYER_ID === this.selectedPayerId);
        if (this.selectedPayerId) method = PayMethod.SIMPLE_TRANSFER;
        else alert('간편결제 방법을 선택해주세요')
        break;
      };
      default: alert('결제 방법을 선택해주세요');
    }
    this.paymentService.pay(method, this.user, this.meeting, phone, this.price, options, coupon, selectedAccount);
  }

  ionViewDidLeave() {
    this.form.reset();
    this.selectedOptionsFromCalendar = this.meeting.options;
    this.selectedOptionsFromCheckbox = [];
  }


  join() {
    const { phone, options } = this.form.value
    const now = moment();
    const time = now.format('YYYYMMDDHHmmss');
    const payment = new PaymentResult(0, phone, 'success', '무료모임 등록성공', undefined, undefined, undefined,
      `nonunbub${this.user.uid}${this.meeting.mid}`, undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, this.meeting.title, '0', undefined, undefined, undefined, undefined, undefined,
      time, undefined, undefined, undefined, this.meeting.mid, this.user.uid);
    this.paymentService.joinFreeMeeting(payment, options, phone, this.user);
  }

  selectSimplePay(id) {
    this.selectedPayerId = id;
  }
}