import { MapsAPILoader } from '@agm/core';
import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/model/category';
import { MeetingOption } from 'src/app/model/meeting';
import { AuthService } from 'src/app/service/auth.service';
import { MeetingService } from 'src/app/service/meeting.service';
import { S3Service } from 'src/app/service/s3.service';
import { FormService } from '../../service/form.service';
import { UtilService } from './../../service/util.service';
import { MeetingControl } from './meeting-control';

@Component({
  selector: 'meeting-add',
  templateUrl: './meeting-add.page.html',
  styleUrls: ['./meeting-add.page.scss'],
})
export class MeetingAddPage extends MeetingControl implements OnInit, AfterViewInit {
  constructor(
    private formService: FormService,
    private router: Router,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    public s3Service: S3Service,
    private utilService: UtilService,
    private authService: AuthService,
    private fb: FormBuilder,
    private meetingService: MeetingService
  ) {
    super(mapsAPILoader, ngZone, s3Service);
  }

  ngOnInit() {
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.user = user;
      this.loadMap();
    });
    this.quillStyle = this.utilService.getQuillStyle();
    this.meetingForm = this.fb.group({
      title: new FormControl('', this.formService.getValidators(30)),
      subTitle: new FormControl('', this.formService.getValidators(40)),
      fileSource: new FormControl(null, Validators.required),
      categories: new FormControl('', this.formService.getValidators(10)),
      address: new FormControl('', this.formService.getValidators(1000)),
      detailAddress: new FormControl('', this.formService.getValidators(500)),
      runningHours: new FormControl('', Validators.compose([Validators.max(23), Validators.min(0)])),
      runningMinutes: new FormControl('', Validators.compose([Validators.max(45), Validators.min(0)])),
      price: new FormControl('', this.formService.getValidators(10, [Validators.max(10000000)])),
      discountPrice: new FormControl(0, [Validators.max(10000000), this.validateDiscountPrice('price')]),
      point: new FormControl('', this.formService.getValidators(500)),
      recommend: new FormControl('', this.formService.getValidators(500)),
      programs: new FormControl('', Validators.required),
      desc: new FormControl('', Validators.maxLength(500)),
      notice: new FormControl('', Validators.maxLength(500)),
      check_list: new FormControl('', this.formService.getValidators(500)),
      include: new FormControl('', Validators.maxLength(500)),
      exclude: new FormControl('', Validators.maxLength(500)),
      refundPolicy100: new FormControl(5, this.formService.getValidators(4, [Validators.max(9999), Validators.min(0)])),
      refundPolicy0: new FormControl(0, this.formService.getValidators(4, [Validators.max(9999), Validators.min(0), this.validateRefundPolicy0('refundPolicy100')])),
      options: this.fb.array([], Validators.required)
    })
  }

  loadMap() {
    this.mapsAPILoader.load().then(() => {
      this.latitude = this.SEOUL_LATITUDE;
      this.longitude = this.SEOUL_LONGITUDE;
      this.zoom = 12;
    });
  }

  add() {
    const { title, subTitle, fileSource, categories, address, detailAddress, runningHours, runningMinutes,
      price, discountPrice, point, recommend, programs, desc, notice, check_list, include, exclude, refundPolicy100, refundPolicy0, options } = this.meetingForm.value;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.geoCoder.geocode({ address }, (result, status) => {
        if (status == "OK") {
          if (result[0]) {
            const uid = this.user.uid;
            const location = result[0].geometry.location;
            const lat = `${location.lat()}`;
            const lon = `${location.lng()}`;
            const discount = discountPrice ? discountPrice : 0;
            const minutes = runningHours * 60 + runningMinutes;

            const formData = new FormData();
            formData.append('title', title);
            formData.append('subTitle', subTitle);
            formData.append('file', fileSource);
            formData.append('categories', `${Category[categories]}`);
            formData.append('address', `${address}`);
            formData.append('detailed_address', detailAddress);
            formData.append('runningMinutes', `${minutes}`);
            formData.append('lat', lat);
            formData.append('lon', lon);
            formData.append('price', `${price}`);
            formData.append('discountPrice', `${discount}`);
            formData.append('point', point);
            formData.append('recommend', recommend);
            formData.append('programs', programs);
            formData.append('desc', desc);
            formData.append('host', `${uid}`);
            formData.append('notice', notice);
            formData.append('likes', `${0}`);
            formData.append('check_list', check_list);
            formData.append('include', include);
            formData.append('exclude', exclude);
            formData.append('refundPolicy100', refundPolicy100);
            formData.append('refundPolicy0', refundPolicy0);

            this.meetingService.addMeeting(formData).subscribe(meeting => {
              const optionList = options.map(option => {
                return new MeetingOption(0, meeting.mid, option.optionTitle, option.optionPrice, option.optionDate,
                  option.optionMinParticipation, option.optionMaxParticipation, false)
              })
              this.meetingService.addMeetingOptions(meeting.mid, optionList).subscribe(resp => {
                alert('모임을 생성하였습니다.');
                this.passDeactivate = true;
                this.router.navigate(['./tabs/meeting-detail', meeting.mid]);
                this.meetingForm.reset();
              })
            })
          }
          else {
            alert('주소 검색 결과가 없습니다.')
          }
        }
        else {
          alert('올바른 주소를 입력해주세요: ' + status);
        }
      });
    });
  }
}
