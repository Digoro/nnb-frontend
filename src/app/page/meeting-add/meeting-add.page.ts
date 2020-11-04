import { MapsAPILoader } from '@agm/core';
import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Stepper from 'bs-stepper';
import { QuillEditorComponent } from 'ngx-quill';
import { Category } from 'src/app/model/category';
import { Meeting, MeetingOption, MeetingStatus } from 'src/app/model/meeting';
import { AuthService } from 'src/app/service/auth.service';
import { MeetingService } from 'src/app/service/meeting.service';
import { FormService } from '../../service/form.service';
import { User } from './../../model/user';
import { UtilService } from './../../service/util.service';

@Component({
  selector: 'meeting-add',
  templateUrl: './meeting-add.page.html',
  styleUrls: ['./meeting-add.page.scss'],
})
export class MeetingAddPage implements OnInit, AfterViewInit {
  user: User;
  quillStyle;
  quill: QuillEditorComponent;
  meetingForm: FormGroup;
  @ViewChild('fileInput') fileInput: ElementRef<any>;
  categories = Object.values(Category).filter(v => typeof Category[v] === 'number');

  options: FormArray;
  stepper: Stepper;
  @ViewChild('stepperRef') stepperRef: ElementRef;

  SEOUL_LATITUDE = 37.566535;
  SEOUL_LONGITUDE = 126.9779692;
  geoCoder: google.maps.Geocoder;
  latitude: number;
  longitude: number;
  zoom: number;

  previewMeeting: Meeting;
  previewImage: string | ArrayBuffer;

  constructor(
    private formService: FormService,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private location: Location,
    private utilService: UtilService,
    private authService: AuthService,
    private fb: FormBuilder,
    private meetingService: MeetingService
  ) { }

  ngAfterViewInit(): void {
    this.stepper = new Stepper(this.stepperRef.nativeElement, {
      linear: false,
      animation: true,
      selectors: {
        trigger: '.trigger',
      }
    });
  }

  quillLoad(event) {
    this.quill = event;
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
      address: new FormControl('', this.formService.getValidators(500)),
      detailAddress: new FormControl('', this.formService.getValidators(500)),
      runningHours: new FormControl('', this.formService.getValidators(2, [Validators.max(23), Validators.min(0)])),
      runningMinutes: new FormControl('', this.formService.getValidators(2, [Validators.max(45), Validators.min(0)])),
      price: new FormControl('', this.formService.getValidators(10, [Validators.max(10000000)])),
      discountPrice: new FormControl(0, [Validators.max(10000000), this.validateDiscountPrice('price')]),
      desc: new FormControl('', Validators.required),
      notice: new FormControl('', Validators.maxLength(500)),
      check_list: new FormControl('', this.formService.getValidators(500)),
      include: new FormControl('', Validators.maxLength(500)),
      exclude: new FormControl('', Validators.maxLength(500)),
      refundPolicy100: new FormControl(5, this.formService.getValidators(4, [Validators.max(9999), Validators.min(0)])),
      refundPolicy0: new FormControl(0, this.formService.getValidators(4, [Validators.max(9999), Validators.min(0), this.validateRefundPolicy0('refundPolicy100')])),
      options: this.fb.array([], Validators.required)
    })

  }

  validateDiscountPrice(controlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const discountPrice = control.value;
      const price = control.root.value[controlName];
      const isUpper = price < discountPrice;
      return isUpper ? { 'isUpper': { isUpper } } : null;
    };
  }

  checkDiscountPrice() {
    const price = this.meetingForm.controls.price;
    const discountPrice = this.meetingForm.controls.discountPrice;
    if (price.value < discountPrice.value) {
      discountPrice.setErrors({ 'isUpper': true })
    } else {
      discountPrice.setErrors({ 'isUpper': null });
    }
    discountPrice.updateValueAndValidity();
  }

  validateRefundPolicy0(controlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const refundPolicy0 = control.value;
      const refundPolicy100 = control.root.value[controlName];
      const isUpper = refundPolicy100 < refundPolicy0 + 2;
      return isUpper ? { 'isUpper': { isUpper } } : null;
    };
  }

  checkRefundPolicy0() {
    const refundPolicy100 = this.meetingForm.controls.refundPolicy100;
    const refundPolicy0 = this.meetingForm.controls.refundPolicy0;
    if (refundPolicy100.value - 2 < refundPolicy0.value) {
      refundPolicy0.setErrors({ 'isUpper': true })
    } else {
      refundPolicy0.setErrors({ 'isUpper': null });
    }
    refundPolicy0.updateValueAndValidity();
  }

  next() {
    const index = this.stepper['_currentIndex'];
    if (index === 9) {
      this.makePreviewMeeting();
    }
    this.stepper.next();
  }

  prev() {
    this.stepper.previous();
  }

  makePreviewMeeting() {
    if (this.meetingForm.valid) {
      const { title, subTitle, fileSource, categories, address, detailAddress, runningHours, runningMinutes,
        price, discountPrice, desc, notice, check_list, include, exclude, refundPolicy100, refundPolicy0, options } = this.meetingForm.value;
      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder;
        this.geoCoder.geocode({ address }, (result, status) => {
          if (status == "OK") {
            if (result[0]) {
              const location = result[0].geometry.location;
              const minutes = runningHours * 60 + runningMinutes;
              this.previewMeeting = new Meeting(0, title, subTitle, desc, address, detailAddress, minutes, location.lat(), location.lng(), 0,
                categories, '', price, discountPrice, 0, notice, check_list, include, exclude, refundPolicy100, refundPolicy0, 0, MeetingStatus.CREATED, options)
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

  readURL(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.previewImage = reader.result
      };
      reader.readAsDataURL(file);
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.meetingForm.patchValue({
        fileSource: file
      });
      this.readURL(event);
    } else {
      this.previewImage = undefined;
    }
  }

  loadMap() {
    this.mapsAPILoader.load().then(() => {
      this.latitude = this.SEOUL_LATITUDE;
      this.longitude = this.SEOUL_LONGITUDE;
      this.zoom = 12;
      this.geoCoder = new google.maps.Geocoder;
      this.getAddress(this.latitude, this.longitude);
      this.setAutoComplete();
    });
  }

  setAutoComplete() {
    setTimeout(() => {
      const nativeHomeInputBox = document.getElementById('addressInput').getElementsByTagName('input')[0];
      console.log(nativeHomeInputBox);
      const autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {});
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (!place.geometry) return;
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 15;
          this.getAddress(this.latitude, this.longitude);
        });
      });
    }, 2000)
  }

  markerDragEnd($event: any) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.zoom = 15;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const address = results[0].formatted_address;
          this.meetingForm.controls['address'].setValue(address);
        } else {
          alert('주소 검색 결과가 없습니다.');
        }
      } else {
        alert('올바른 주소를 입력해주세요: ' + status);
      }
    });
  }

  ngOnDestroy() {
    this.stepper.reset();
    this.meetingForm.reset();
    this.previewImage = undefined;
    // this.fileInput.nativeElement.value = '';
  }

  add() {
    const { title, subTitle, fileSource, categories, address, detailAddress, runningHours, runningMinutes,
      price, discountPrice, desc, notice, check_list, include, exclude, refundPolicy100, refundPolicy0, options } = this.meetingForm.value;
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

  back() {
    this.location.back();
  }
}
