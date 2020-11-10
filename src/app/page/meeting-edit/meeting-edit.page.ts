import { MapsAPILoader } from '@agm/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/model/category';
import { Meeting, MeetingOption } from 'src/app/model/meeting';
import { AuthService } from 'src/app/service/auth.service';
import { MeetingService } from 'src/app/service/meeting.service';
import { FormService } from '../../service/form.service';
import { S3Service } from './../../service/s3.service';
import { UtilService } from './../../service/util.service';
import { MeetingControl } from './../meeting-add/meeting-control';

@Component({
  selector: 'meeting-edit',
  templateUrl: './meeting-edit.page.html',
  styleUrls: ['./meeting-edit.page.scss'],
})
export class MeetingEditPage extends MeetingControl implements OnInit, AfterViewInit {
  meeting: Meeting;
  oldOptions: MeetingOption[];

  constructor(
    private formService: FormService,
    private router: Router,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    public s3Service: S3Service,
    private utilService: UtilService,
    private authService: AuthService,
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private route: ActivatedRoute,
  ) {
    super(mapsAPILoader, ngZone, s3Service)
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
      address: new FormControl('', this.formService.getValidators(1000)),
      detailAddress: new FormControl('', this.formService.getValidators(500)),
      runningHours: new FormControl('', Validators.compose([Validators.max(23), Validators.min(0)])),
      runningMinutes: new FormControl('', Validators.compose([Validators.max(45), Validators.min(0)])),
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

  private setFormControlsValue(meeting: Meeting) {
    const noti = meeting.notice.replace(/<br>/g, "\n");
    const check = meeting.check_list.replace(/<br>/g, "\n");
    const inc = meeting.include.replace(/<br>/g, "\n");
    const ex = meeting.exclude.replace(/<br>/g, "\n");
    this.meetingForm.controls.title.setValue(meeting.title);
    this.meetingForm.controls.subTitle.setValue(meeting.subTitle);
    this.meetingForm.controls.fileSource.setValue(meeting.file);
    this.previewImage = meeting.file;
    this.meetingForm.controls.categories.setValue(Category[+meeting.categories]);
    this.meetingForm.controls.address.setValue(meeting.address);
    this.meetingForm.controls.detailAddress.setValue(meeting.detailed_address);
    this.meetingForm.controls.runningHours.setValue(Math.floor(meeting.runningMinutes / 60));
    this.meetingForm.controls.runningMinutes.setValue(meeting.runningMinutes % 60);
    this.meetingForm.controls.price.setValue(meeting.price);
    this.meetingForm.controls.discountPrice.setValue(meeting.discountPrice);
    this.meetingForm.controls.desc.setValue(meeting.desc);
    this.meetingForm.controls.notice.setValue(noti);
    this.meetingForm.controls.check_list.setValue(check);
    this.meetingForm.controls.include.setValue(inc);
    this.meetingForm.controls.exclude.setValue(ex);
    this.meetingForm.controls.refundPolicy100.setValue(meeting.refundPolicy100);
    this.meetingForm.controls.refundPolicy0.setValue(meeting.refundPolicy0);
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

  loadMap(meeting: Meeting) {
    this.mapsAPILoader.load().then(() => {
      this.latitude = meeting.lat
      this.longitude = meeting.lon;
      this.zoom = 15;
    });
  }

  edit() {
    const { title, subTitle, fileSource, categories, address, detailAddress, runningHours, runningMinutes,
      price, discountPrice, desc, notice, check_list, include, exclude, refundPolicy100, refundPolicy0, options } = this.meetingForm.value;
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
            formData.append('check_list', check_list);
            formData.append('include', include);
            formData.append('exclude', exclude);
            formData.append('refundPolicy100', refundPolicy100);
            formData.append('refundPolicy0', refundPolicy0);
            formData.append('likes', `${this.meeting.likes}`);

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
                  this.passDeactivate = true;
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
}
