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
import { S3Service } from '../../service/s3.service';
import { environment } from './../../../environments/environment';
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
    private meetingService: MeetingService,
    private s3Service: S3Service
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

  getEditorInstance(editorInstance: any) {
    let toolbar = editorInstance.getModule('toolbar');
    toolbar.addHandler('image', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.click();
      input.onchange = () => {
        const file = input.files[0];
        this.s3Service.uploadFile(file, environment.folder.meeting).then(res => {
          const editor = this.quill.quillEditor;
          const range = editor.getSelection();
          editor.insertEmbed(range.index, 'image', `${res.Location}`, 'user');
        })
      };
    });
  }

  ngOnInit() {
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.user = user;
    });
    this.quillStyle = this.utilService.getQuillStyle();
    this.meetingForm = this.fb.group({
      title: new FormControl('', this.formService.getValidators(30)),
      subTitle: new FormControl('', this.formService.getValidators(40)),
      fileSource: new FormControl(null, Validators.required),
      categories: new FormControl('', this.formService.getValidators(10)),
      address: new FormControl('', this.formService.getValidators(500)),
      detailAddress: new FormControl('', this.formService.getValidators(500)),
      price: new FormControl('', this.formService.getValidators(10, [Validators.max(10000000)])),
      discountPrice: new FormControl(0, [Validators.max(10000000), this.validateDiscountPrice('price')]),
      desc: new FormControl('', Validators.required),
      refund_policy: new FormControl('', this.formService.getValidators(500)),
      notice: new FormControl('', Validators.maxLength(500)),
      check_list: new FormControl('', this.formService.getValidators(500)),
      include: new FormControl('', Validators.maxLength(500)),
      exclude: new FormControl('', Validators.maxLength(500)),
      options: this.fb.array([this.createItem()], Validators.required)
    })
    this.loadMap();
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
      discountPrice.updateValueAndValidity();
    }
  }

  createItem() {
    return this.fb.group({
      oid: [''],
      optionTitle: ['', this.formService.getValidators(100)],
      optionPrice: ['', this.formService.getValidators(10, [Validators.max(10000000)])],
      optionMinParticipation: ['', this.formService.getValidators(10, [Validators.max(1000)])],
      optionMaxParticipation: ['', this.formService.getValidators(10, [Validators.max(1000)])],
      optionTo: ['', Validators.required],
      optionFrom: ['', Validators.required],
    });
  }

  addItem(): void {
    this.options = this.meetingForm.get('options') as FormArray;
    this.options.push(this.createItem());
    console.log(this.meetingForm.get('options')['controls']);

  }

  minusItem(index: number): void {
    this.options = this.meetingForm.get('options') as FormArray;
    this.options.removeAt(index)
  }

  changeSchedule(event) {
    console.log(`dd:${event}`);
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
      const { title, subTitle, fileSource, categories, address, detailAddress,
        price, discountPrice, desc, refund_policy, notice, check_list, include, exclude, options } = this.meetingForm.value;
      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder;
        this.geoCoder.geocode({ address }, (result, status) => {
          if (status == "OK") {
            if (result[0]) {
              const location = result[0].geometry.location;
              this.previewMeeting = new Meeting(0, title, subTitle, desc, address, detailAddress, location.lat(), location.lng(), 0,
                categories, '', price, discountPrice, 0, refund_policy, notice, check_list, include, exclude, 0, MeetingStatus.CREATED, options)
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
    const nativeHomeInputBox = document.getElementById('addressInput').getElementsByTagName('input')[0];
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
  }

  markerDragEnd($event: any) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.zoom = 15;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
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
    const { title, subTitle, fileSource, categories, address, detailAddress,
      price, discountPrice, desc, refund_policy, notice, check_list, include, exclude, options } = this.meetingForm.value;
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

            const formData = new FormData();
            formData.append('title', title);
            formData.append('subTitle', subTitle);
            formData.append('file', fileSource);
            formData.append('categories', `${Category[categories]}`);
            formData.append('address', `${address}`);
            formData.append('detailed_address', detailAddress);
            formData.append('lat', lat);
            formData.append('lon', lon);
            formData.append('price', `${price}`);
            formData.append('discountPrice', `${discount}`);
            formData.append('desc', desc);
            formData.append('host', `${uid}`);
            formData.append('refund_policy', refund_policy);
            formData.append('notice', notice);
            formData.append('likes', `${0}`);
            formData.append('check_list', check_list);
            formData.append('include', include);
            formData.append('exclude', exclude);

            this.meetingService.addMeeting(formData).subscribe(meeting => {
              const optionList = options.map(option => {
                return new MeetingOption(0, meeting.mid, option.optionTitle, option.optionPrice, option.optionTo, option.optionFrom,
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
