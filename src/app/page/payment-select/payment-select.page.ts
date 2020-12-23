import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarComponentOptions, CalendarDay } from 'ion2-calendar';
import * as moment from 'moment';
import { PaymentResult } from 'src/app/model/payment';
import { User } from 'src/app/model/user';
import { FormService } from 'src/app/service/form.service';
import { Coupon } from '../../model/coupon';
import { Meeting, MeetingOption } from '../../model/meeting';
import { MeetingService } from '../../service/meeting.service';
import { PaymentService } from '../../service/payment.service';
import { AuthService } from './../../service/auth.service';
import { UserService } from './../../service/user.service';

@Component({
  selector: 'payment',
  templateUrl: './payment-select.page.html',
  styleUrls: ['./payment-select.page.scss'],
})
export class PaymentSelectPage implements OnInit {
  user: User;
  meeting: Meeting;
  price: number;
  form: FormGroup;
  isFree = true;
  options: FormArray = new FormArray([]);
  coupons: Coupon[]
  selectedOptionsFromCalendar: MeetingOption[];
  calendarOptions: CalendarComponentOptions;
  phone: string;
  alreadyExistPhone = false;
  alreadyExistName = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService,
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
      const mid = params.mid;
      this.meetingService.getMeeting(mid).subscribe(meeting => {
        this.authService.getCurrentNonunbubUser().subscribe(user => {
          this.user = user;
          if (this.user.phone) {
            this.phone = this.user.phone;
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
                date: moment(option.optionDate).toDate(),
                marked: true,
                disable: false,
                cssClass: '',
              }
            })
          }
          this.isFree = this.meeting.price === 0;
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
      const optionMonth = +moment(option.optionDate).format('M');
      const optionDay = +moment(option.optionDate).format('D');
      return month === optionMonth && day === optionDay;
    })
    this.selectedOptionsFromCalendar = selectedOptions;
  }

  setPrice() {
    if (this.options.value.length > 0) {
      this.price = this.options.value.map(option => option.optionPrice * +option.optionCount).reduce((a, b) => a + b);
    }
  }

  changeCount(flag: boolean, option: MeetingOption) {
    const optionArray = this.options.controls.find(o => o.value.oid === option.oid);
    const count = flag ? +document.getElementById('optionCount' + option.oid)['value'] + 1 : +document.getElementById('optionCount' + option.oid)['value'] - 1;
    if (count > option.optionMaxParticipation) {
      alert(`최대 신청인원은 ${option.optionMaxParticipation}명 입니다.`);
      return;
    }
    document.getElementById('optionCount' + option.oid)['value'] = count;

    if (count > 0 && !optionArray) {
      this.addItem(option);
    } else if (count <= 0 && optionArray) {
      this.minusItem(option);
      document.getElementById('optionCount' + option.oid)['value'] = 0;
    } else if (count <= 0 && !optionArray) {
      document.getElementById('optionCount' + option.oid)['value'] = 0;
    } else if (count > 0 && optionArray) {
      optionArray.value.optionCount = count;
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
      optionDate: [option.optionDate]
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
      if (moment(a.value.optionDate).isBefore(b.value.optionDate)) return -1;
      else if (moment(a.value.optionDate).isSame(b.value.optionDate)) return 0;
      else return 1;
    })
  }

  onAddPhone(phone) {
    this.phone = phone;
  }

  pay() {
    const obj: any = {};
    obj.mid = this.meeting.mid;
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
    const now = moment();
    const time = now.format('YYYYMMDDHHmmss');

    const payment = new PaymentResult(0, this.meeting.mid, this.user.uid, this.phone, 'success', '무료모임 등록 성공',
      undefined, undefined, undefined, `nonunbub${this.user.uid}${this.meeting.mid}`, undefined, undefined
      , undefined, undefined, undefined, undefined, undefined, this.meeting.title, '0', undefined, undefined
      , undefined, undefined, undefined, time, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined
      , undefined, undefined, undefined, undefined, this.phone, undefined)
    this.paymentService.joinFreeMeeting(payment, options, this.phone, this.user);
    this.userService.edit(this.user.uid, undefined, undefined, this.form.controls.name.value).subscribe(resp => {
      console.log(resp);
    })
  }
}