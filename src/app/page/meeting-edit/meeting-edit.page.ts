import { MapsAPILoader } from '@agm/core';
import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Stepper from 'bs-stepper';
import { QuillEditorComponent } from 'ngx-quill';
import { Category } from 'src/app/model/category';
import { Meeting, MeetingOption, MeetingStatus } from 'src/app/model/meeting';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { MeetingService } from 'src/app/service/meeting.service';
import { environment } from 'src/environments/environment';
import { FormService } from '../../service/form.service';
import { S3Service } from '../../service/s3.service';
import { UtilService } from './../../service/util.service';

@Component({
  selector: 'meeting-edit',
  templateUrl: './meeting-edit.page.html',
  styleUrls: ['./meeting-edit.page.scss'],
})
export class MeetingEditPage implements OnInit, AfterViewInit {
  user: User;
  quillStyle;
  quill: QuillEditorComponent;
  meeting: Meeting;
  oldOptions: MeetingOption[];
  previewMeeting: Meeting;
  meetingForm: FormGroup;
  @ViewChild('fileInput') fileInput: ElementRef<any>;
  categories = Object.values(Category).filter(v => typeof Category[v] === 'number');

  options: FormArray;
  stepper: Stepper;
  @ViewChild('stepperRef') stepperRef: ElementRef;

  geoCoder: google.maps.Geocoder;
  latitude: number;
  longitude: number;
  address: string;
  zoom: number;

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
    private route: ActivatedRoute,
    private http: HttpClient,
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
      runningMinutes: new FormControl('', this.formService.getValidators(4, [Validators.max(1440), Validators.min(1)])),
      price: new FormControl('', this.formService.getValidators(10, [Validators.max(10000000)])),
      discountPrice: new FormControl(0, [Validators.max(10000000), this.validateDiscountPrice('price')]),
      desc: new FormControl('', Validators.required),
      refund_policy: new FormControl('', this.formService.getValidators(500)),
      notice: new FormControl('', Validators.maxLength(500)),
      check_list: new FormControl('', this.formService.getValidators(500)),
      include: new FormControl('', Validators.maxLength(500)),
      exclude: new FormControl('', Validators.maxLength(500)),
      options: this.fb.array([], Validators.required)
    })
    this.route.params.subscribe(params => {
      this.meetingService.getMeeting(+params.id).subscribe(resp => {
        this.meeting = resp;
        this.oldOptions = this.meeting.options;
        this.setFormControlsValue(this.meeting);
        this.loadMap(this.meeting);
      }, error => {
        if ((error as HttpErrorResponse).status === 404) {
          alert('모임이 존재하지 않습니다.');
          this.router.navigate(['/tabs/home']);
        }
      });
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
      discountPrice.updateValueAndValidity();
    }
  }

  private setFileFormControl() {
    this.http.get(this.meeting.file, { responseType: 'blob' }).subscribe(resp => {
      const splitted = this.meeting.file.split("/");
      const name = splitted[splitted.length - 1];
      const decoded = decodeURI(name);
      const file: File = this.blobToFile(resp, decoded);
      this.meetingForm.controls.fileSource.setValue(file);
    });
  }

  private blobToFile = (blob: Blob, fileName: string): File => {
    var b: any = blob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return new File([blob], fileName)
  }

  private setFormControlsValue(meeting: Meeting) {
    const rp = meeting.refund_policy.replace(/<br>/g, "\n");
    const noti = meeting.notice.replace(/<br>/g, "\n");
    const check = meeting.check_list.replace(/<br>/g, "\n");
    const inc = meeting.include.replace(/<br>/g, "\n");
    const ex = meeting.exclude.replace(/<br>/g, "\n");
    this.meetingForm.controls.title.setValue(meeting.title);
    this.meetingForm.controls.subTitle.setValue(meeting.subTitle);
    this.setFileFormControl();
    this.previewImage = meeting.file;
    this.meetingForm.controls.categories.setValue(Category[+meeting.categories]);
    this.meetingForm.controls.address.setValue(meeting.address);
    this.meetingForm.controls.detailAddress.setValue(meeting.detailed_address);
    this.meetingForm.controls.runningMinutes.setValue(meeting.runningMinutes);
    this.meetingForm.controls.price.setValue(meeting.price);
    this.meetingForm.controls.discountPrice.setValue(meeting.discountPrice);
    this.meetingForm.controls.desc.setValue(meeting.desc);
    this.meetingForm.controls.refund_policy.setValue(rp);
    this.meetingForm.controls.notice.setValue(noti);
    this.meetingForm.controls.check_list.setValue(check);
    this.meetingForm.controls.include.setValue(inc);
    this.meetingForm.controls.exclude.setValue(ex);
    meeting.options.forEach(option => {
      this.options = this.meetingForm.get('options') as FormArray;
      const form = this.fb.group({
        oid: [option.oid],
        optionTitle: [option.optionTitle, this.formService.getValidators(100)],
        optionPrice: [option.optionPrice, this.formService.getValidators(10, [Validators.max(10000000)])],
        optionMinParticipation: [option.optionMinParticipation, this.formService.getValidators(10, [Validators.max(1000)])],
        optionMaxParticipation: [option.optionMaxParticipation, this.formService.getValidators(10, [Validators.max(1000)])],
        optionDate: [option.optionDate, Validators.required]
      });
      this.options.push(form);
    })
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
      const { title, subTitle, fileSource, categories, address, detailAddress, runningMinutes,
        price, discountPrice, desc, refund_policy, notice, check_list, include, exclude, options } = this.meetingForm.value;
      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder;
        this.geoCoder.geocode({ address }, (result, status) => {
          if (status == "OK") {
            if (result[0]) {
              const location = result[0].geometry.location;
              this.previewMeeting = new Meeting(0, title, subTitle, desc, address, detailAddress, runningMinutes, location.lat(), location.lng(), 0,
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

  loadMap(meeting: Meeting) {
    this.mapsAPILoader.load().then(() => {
      this.latitude = meeting.lat
      this.longitude = meeting.lon;
      this.zoom = 15;
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
          this.address = results[0].formatted_address;
          this.meetingForm.controls['address'].setValue(this.address);
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

  edit() {
    const { title, subTitle, fileSource, categories, address, detailAddress, runningMinutes,
      price, discountPrice, desc, refund_policy, notice, check_list, include, exclude, options } = this.meetingForm.value;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.geoCoder.geocode({ address }, (result, status) => {
        if (status == "OK") {
          if (result[0]) {
            const uid = this.meeting.host;
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
            formData.append('runningMinutes', `${runningMinutes}`);
            formData.append('lat', lat);
            formData.append('lon', lon);
            formData.append('price', `${price}`);
            formData.append('discountPrice', `${discount}`);
            formData.append('desc', desc);
            formData.append('host', `${uid}`);
            formData.append('refund_policy', refund_policy);
            formData.append('notice', notice);
            formData.append('check_list', check_list);
            formData.append('include', include);
            formData.append('exclude', exclude);
            formData.append('likes', `${this.meeting.likes}`);
            console.log(this.meeting);
            console.log(this.oldOptions);

            this.meetingService.editMeeting(this.meeting.mid, formData).subscribe(meeting => {
              // newWrittenOptions: 새롭게 쓰인 옵션
              // deletedOptions: 삭제된 옵션
              // changedOldOptions: 수정되서 old인 옵션
              // changedNewOptions: 수정되서 새롭게 추가할 옵션
              const writtenOptions = (options as MeetingOption[]);
              const newWrittenOptions = writtenOptions
                .filter(option => !option.oid)
                .map(option => new MeetingOption(0, meeting.mid, option.optionTitle, option.optionPrice, option.optionDate, option.optionMinParticipation,
                  option.optionMaxParticipation, false))

              const deletedOptions = this.oldOptions
                .filter(old => !writtenOptions.find(option => old.oid === option.oid))
                .map(option => new MeetingOption(option.oid, meeting.mid, option.optionTitle, option.optionPrice, option.optionDate,
                  option.optionMinParticipation, option.optionMaxParticipation, true))

              const changedOldOptions: MeetingOption[] = [];
              const changedNewOptions = writtenOptions
                .filter(option => !!option.oid)
                .filter(option => {
                  const newO = new MeetingOption(option.oid, meeting.mid, option.optionTitle, option.optionPrice, option.optionDate,
                    option.optionMinParticipation, option.optionMaxParticipation, false);
                  const oldO = this.oldOptions.find(oldO => oldO.oid === newO.oid);
                  const isEditable =
                    newO.optionDate !== oldO.optionDate ||
                    newO.optionPrice !== oldO.optionPrice ||
                    newO.optionMinParticipation !== oldO.optionMinParticipation ||
                    newO.optionMaxParticipation !== oldO.optionMaxParticipation ||
                    newO.optionTitle !== oldO.optionTitle
                  if (isEditable) {
                    changedOldOptions.push(oldO)
                  }
                  return isEditable;
                })
                .map(option => new MeetingOption(0, meeting.mid, option.optionTitle, option.optionPrice, option.optionDate,
                  option.optionMinParticipation, option.optionMaxParticipation, false))

              const addOptions = newWrittenOptions.concat(changedNewOptions);
              const editOptions = changedOldOptions.map(option => {
                option.isOld = true;
                return option
              }).concat(deletedOptions)

              this.meetingService.addMeetingOptions(meeting.mid, addOptions).subscribe(resp => {
                this.meetingService.editMeetingOptions(editOptions).subscribe(resp => {
                  alert('모임을 수정하였습니다.');
                  this.router.navigate(['./tabs/meeting-detail', meeting['mid']]);
                  this.meetingForm.reset();
                });
              });
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
