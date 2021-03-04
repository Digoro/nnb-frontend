import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarComponentOptions, CalendarDay } from 'ion2-calendar';
import * as moment from 'moment';
import { User } from 'src/app/model/user';
import { FormService } from 'src/app/service/form.service';
import { Coupon } from '../../model/coupon';
import { Product, ProductOption, ProductStatus } from '../../model/product';
import { ProductService } from '../../service/meeting.service';
import { PaymentService } from '../../service/payment.service';
import { OrderCreateDto, OrderItemCreateDto, PaymentCreateDto, PayMethod } from './../../model/payment';
import { AuthService } from './../../service/auth.service';
import { UserService } from './../../service/user.service';

@Component({
  selector: 'payment',
  templateUrl: './payment-select.page.html',
  styleUrls: ['./payment-select.page.scss'],
})
export class PaymentSelectPage implements OnInit {
  user: User;
  meeting: Product;
  ProductStatus = ProductStatus;
  price: number;
  form: FormGroup;
  isFree = true;
  options: FormArray = new FormArray([]);
  coupons: Coupon[]
  selectedOptionsFromCalendar: ProductOption[];
  calendarOptions: CalendarComponentOptions;
  phoneNumber: string;
  alreadyExistPhone = false;
  alreadyExistName = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: ProductService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private formService: FormService,
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.form = this.fb.group({
      options: this.fb.array([], Validators.required),
      name: new FormControl('', this.formService.getValidators(30)),
    })
  }

  ionViewDidEnter() {
    this.initForm()
    this.route.params.subscribe(params => {
      this.meetingService.getProduct(params.id).subscribe(meeting => {
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
          this.meeting = meeting;
          this.calendarOptions = {
            color: 'primary',
            to: null,
            monthFormat: 'YYYY.MM',
            weekdays: ['일', '월', '화', '수', '목', '금', '토'],
            monthPickerFormat: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            daysConfig: this.meeting.options.map(option => {
              return {
                date: moment(option.date).toDate(),
                marked: true,
                disable: false,
                cssClass: '',
              }
            })
          }
          this.isFree = this.meeting.price === 0 || this.meeting.discountPrice === 0;
          if (!this.isFree) {
            this.form.controls.name.clearValidators();
            this.form.controls.name.updateValueAndValidity();
          }
        });
      })
    })
  }

  selectCalendar(event: CalendarDay) {
    this.options.controls = [];
    this.options.reset();
    const month = +moment(event.time).format('M')
    const day = +moment(event.time).get('D')

    const selectedOptions = this.meeting.options.filter(option => {
      const optionMonth = +moment(option.date).format('M');
      const optionDay = +moment(option.date).format('D');
      return month === optionMonth && day === optionDay;
    })
    this.selectedOptionsFromCalendar = selectedOptions;
  }

  setPrice() {
    if (this.options.value.length > 0) {
      this.price = this.options.value.map(option => option.price * +option.count).reduce((a, b) => a + b);
    }
  }

  changeCount(flag: boolean, option: ProductOption) {
    const optionArray = (this.options.controls).find(o => {
      return o.value.id === option.id;
    });
    const count = flag ? +document.getElementById('count' + option.id)['value'] + 1 : +document.getElementById('count' + option.id)['value'] - 1;
    if (count > option.maxParticipants) {
      alert(`최대 신청인원은 ${option.maxParticipants}명 입니다.`);
      return;
    }
    document.getElementById('count' + option.id)['value'] = count;

    if (count > 0 && !optionArray) {
      this.addItem(option);
    } else if (count <= 0 && optionArray) {
      this.minusItem(option);
      document.getElementById('count' + option.id)['value'] = 0;
    } else if (count <= 0 && !optionArray) {
      document.getElementById('count' + option.id)['value'] = 0;
    } else if (count > 0 && optionArray) {
      optionArray.value.count = count;
    }

    this.setPrice()
    this.options.controls = this.sortSelectedOptions(this.options.controls)
  }

  createItem(option: ProductOption) {
    return this.fb.group({
      id: [option.id, Validators.required],
      name: [option.name, Validators.required],
      price: [option.price, Validators.required],
      description: [option.description],
      count: [1, this.formService.getValidators(10, [Validators.min(1), Validators.max(999)])],
      date: [option.date]
    });
  }

  addItem(option: ProductOption): void {
    this.options = this.form.get('options') as FormArray;
    this.options.push(this.createItem(option));
  }

  minusItem(option: ProductOption): void {
    this.options = this.form.get('options') as FormArray;
    const value = this.options.value.find(o => o.id === option.id)
    const index = this.options.value.indexOf(value)
    this.options.removeAt(index);
  }

  sortSelectedOptions(controls: AbstractControl[]) {
    return controls.sort((a, b) => {
      if (moment(a.value.date).isBefore(b.value.date)) return -1;
      else if (moment(a.value.date).isSame(b.value.date)) return 0;
      else return 1;
    })
  }

  onAddPhone(phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  pay() {
    const obj: any = {};
    obj.id = this.meeting.id;
    obj.options = this.options.controls.map(control => {
      return control.value;
    })
    const queryParams = JSON.stringify(obj)
    this.router.navigate(['/tabs/payment/pay', { queryParams: queryParams }]);
  }

  ionViewDidLeave() {
    this.form.reset();
    this.selectedOptionsFromCalendar = undefined;
  }

  join() {
    const { options } = this.form.value
    const now = new Date();
    const orderItems = options.map(option => new OrderItemCreateDto(option.id, option.count));
    const order = new OrderCreateDto(this.user.id, this.meeting.id, undefined, undefined, now, orderItems)
    const payment = new PaymentCreateDto(order, undefined, undefined, now, 0, PayMethod.FREE, 0, 0, true, '무료모임 등록 성공');

    this.paymentService.joinFreeMeeting(payment).subscribe(resp => {
      this.userService.edit(this.user.id, undefined, undefined, this.form.controls.name.value).subscribe(resp => {
        console.log(resp);
      })
      alert('등록한 모임으로 이동합니다.');
      this.router.navigate(['/tabs/my-info']);
    })
  }
}