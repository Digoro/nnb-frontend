import { MapsAPILoader } from '@agm/core';
import { AfterViewInit, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ValidatorFn } from '@angular/forms';
import Stepper from 'bs-stepper';
import { QuillEditorComponent } from 'ngx-quill';
import { Category } from 'src/app/model/category';
import { Meeting, MeetingStatus } from 'src/app/model/meeting';
import { User } from 'src/app/model/user';

export class MeetingControl implements AfterViewInit {
    user: User;
    quillStyle;
    quill: QuillEditorComponent;
    meetingForm: FormGroup;
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

    passDeactivate = false;
    @HostListener('window:beforeunload', ['$event'])
    unloadNotification(event: any) {
        if (!this.passDeactivate && this.meetingForm.dirty) {
            event.returnValue = true;
        }
    }

    constructor(
        public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
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

    validateDiscountPrice(controlName: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const discountPrice = +control.value;
            const price = +control.root.value[controlName];
            const isUpper = price < discountPrice;
            return isUpper ? { 'isUpper': { isUpper } } : null;
        };
    }

    checkDiscountPrice() {
        const price = this.meetingForm.controls.price;
        const discountPrice = this.meetingForm.controls.discountPrice;
        if (+price.value < +discountPrice.value) {
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

    changeAddress(event) {
        this.meetingForm.controls.address.setValue(event.roadAddress);
        this.geoCoder = new google.maps.Geocoder;
        this.geoCoder.geocode({ address: event.roadAddress }, (result, status) => {
            this.ngZone.run(() => {
                this.latitude = result[0].geometry.location.lat()
                this.longitude = result[0].geometry.location.lng()
                this.zoom = 15;
            });
        });
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
        const fileTypes = ["image/gif", "image/jpeg", "image/png"];
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            if (fileTypes.find(t => t === file.type)) {
                if (file.size < 500000) {
                    this.meetingForm.patchValue({ fileSource: file });
                    this.readURL(event);
                } else {
                    alert(`이미지 사이즈가 500KB를 넘습니다. (사이즈: 약 ${Math.ceil(file.size / 1000)}KB)`);
                }
            } else {
                alert(`이미지 형식만 가능합니다. (${fileTypes})`);
            }
        } else {
            alert(`파일이 선택되지 않았습니다.`);
        }
    }

    ngOnDestroy() {
        this.stepper.reset();
        this.meetingForm.reset();
        this.previewImage = undefined;
    }
}