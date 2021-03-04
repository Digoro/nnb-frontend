import { MapsAPILoader } from '@agm/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HashtagCreateDto, HashtagType, Product, ProductOption, ProductOptionCreateDto, ProductRepresentationPhotoCreateDto } from 'src/app/model/product';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/meeting.service';
import { FormService } from '../../service/form.service';
import { ProductUpdateDto } from './../../model/product';
import { S3Service } from './../../service/s3.service';
import { UtilService } from './../../service/util.service';
import { MeetingControl } from './../meeting-add/meeting-control';

@Component({
  selector: 'meeting-edit',
  templateUrl: './meeting-edit.page.html',
  styleUrls: ['./meeting-edit.page.scss'],
})
export class MeetingEditPage extends MeetingControl implements OnInit, AfterViewInit {
  meeting: Product;
  oldOptions: ProductOption[];

  constructor(
    private formService: FormService,
    private router: Router,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    public s3Service: S3Service,
    private utilService: UtilService,
    private authService: AuthService,
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {
    super(mapsAPILoader, ngZone, s3Service)
  }

  ngOnInit() {
    this.productService.searchHashtag({ page: 1, limit: 10 }).subscribe(resp => {
      this.hashtags = resp.items;
    })
    this.productService.searchCategory({ page: 1, limit: 10 }).subscribe(resp => {
      this.categories1 = resp.items;
    })
    this.authService.getCurrentNonunbubUser().subscribe(user => {
      this.user = user;
    });
    this.quillStyle = this.utilService.getQuillStyle();
    this.meetingForm = this.fb.group({
      title: new FormControl('', this.formService.getValidators(30)),
      hashtags: new FormControl('', Validators.required),
      fileSource: new FormControl(null, Validators.required),
      categories: new FormControl('', Validators.required),
      address: new FormControl('', this.formService.getValidators(1000)),
      detailAddress: new FormControl('', this.formService.getValidators(500)),
      runningHours: new FormControl('', Validators.compose([Validators.max(23), Validators.min(0)])),
      runningMinutes: new FormControl('', Validators.compose([Validators.max(45), Validators.min(0)])),
      price: new FormControl('', this.formService.getValidators(10, [Validators.max(10000000)])),
      discountPrice: new FormControl('', [Validators.max(10000000), this.validateDiscountPrice('price')]),
      point: new FormControl('', Validators.maxLength(500)),
      recommend: new FormControl('', Validators.maxLength(500)),
      description: new FormControl('', Validators.required),
      notice: new FormControl('', Validators.maxLength(500)),
      checkList: new FormControl('', this.formService.getValidators(500)),
      includeList: new FormControl('', Validators.maxLength(500)),
      excludeList: new FormControl('', Validators.maxLength(500)),
      refundPolicy100: new FormControl(5, this.formService.getValidators(4, [Validators.max(9999), Validators.min(0)])),
      refundPolicy0: new FormControl(0, this.formService.getValidators(4, [Validators.max(9999), Validators.min(0), this.validateRefundPolicy0('refundPolicy100')])),
      options: this.fb.array([], Validators.required)
    })
    this.route.params.subscribe(params => {
      this.productService.getProduct(+params.id).subscribe(resp => {
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

  private setFormControlsValue(product: Product) {
    const noti = product.notice.replace(/<br>/g, "\n");
    const check = product.checkList.replace(/<br>/g, "\n");
    const inc = product.includeList.replace(/<br>/g, "\n");
    const ex = product.excludeList.replace(/<br>/g, "\n");
    this.meetingForm.controls.title.setValue(product.title);
    this.meetingForm.controls.hashtags.setValue(product.hashtags.map(h => h.id));
    //todo representationPhotos
    this.meetingForm.controls.fileSource.setValue(product.representationPhotos[0].photo);
    this.previewImage = product.representationPhotos[0].photo;
    this.meetingForm.controls.categories.setValue(product.categories.map(c => c.id));
    this.meetingForm.controls.address.setValue(product.address);
    this.meetingForm.controls.detailAddress.setValue(product.detailAddress);
    this.meetingForm.controls.runningHours.setValue(Math.floor(product.runningMinutes / 60));
    this.meetingForm.controls.runningMinutes.setValue(product.runningMinutes % 60);
    this.meetingForm.controls.price.setValue(product.price);
    this.meetingForm.controls.discountPrice.setValue(product.discountPrice);
    this.meetingForm.controls.point.setValue(product.point);
    this.meetingForm.controls.recommend.setValue(product.recommend);
    this.meetingForm.controls.description.setValue(product.description);
    this.meetingForm.controls.notice.setValue(noti);
    this.meetingForm.controls.checkList.setValue(check);
    this.meetingForm.controls.includeList.setValue(inc);
    this.meetingForm.controls.excludeList.setValue(ex);
    this.meetingForm.controls.refundPolicy100.setValue(product.refundPolicy100);
    this.meetingForm.controls.refundPolicy0.setValue(product.refundPolicy0);
    product.options.forEach(option => {
      this.options = this.meetingForm.get('options') as FormArray;
      const form = this.fb.group({
        id: [option.id],
        name: [option.name, this.formService.getValidators(100)],
        description: [option.description, Validators.maxLength(300)],
        price: [option.price, this.formService.getValidators(10, [Validators.max(10000000)])],
        minParticipants: [option.minParticipants, this.formService.getValidators(10, [Validators.max(1000)])],
        maxParticipants: [option.maxParticipants, this.formService.getValidators(10, [Validators.max(1000)])],
        date: [option.date, Validators.required]
      });
      this.options.push(form);
    })
  }

  loadMap(meeting: Product) {
    this.mapsAPILoader.load().then(() => {
      this.latitude = meeting.lat
      this.longitude = meeting.lon;
      this.zoom = 15;
    });
  }

  edit() {
    const { title, hashtags, fileSource, categories, address, detailAddress, runningHours, runningMinutes, price, discountPrice, point, recommend,
      description, notice, checkList, includeList, excludeList, refundPolicy100, refundPolicy0, options } = this.meetingForm.value;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.geoCoder.geocode({ address }, (result, status) => {
        if (status == "OK") {
          if (result[0]) {
            const location = result[0].geometry.location;
            const hashtagNames = hashtags.map(v => {
              if (v.label) return new HashtagCreateDto(HashtagType.PRODUCT, false, v.label);
              else return new HashtagCreateDto(HashtagType.PRODUCT, false, undefined, v);
            });
            const minutes = (+runningHours) * 60 + (+runningMinutes);
            const dto = {
              title, point, recommend, description, address, detailAddress, runningMinutes: minutes, price: +price, discountPrice: +discountPrice,
              lat: location.lat(), lon: location.lng(), notice, checkList, includeList, excludeList, refundPolicy100, refundPolicy0, sortOrder: 0,
              status: this.meeting.status, hashtags: hashtagNames, categories, representationPhotos: [new ProductRepresentationPhotoCreateDto(fileSource, 0)]
            } as ProductUpdateDto
            const writtenOptions = (options as ProductOption[]);
            const addedOptions = writtenOptions
              .filter(option => !option.id)
              .map(option => this.makeOption(option, false));
            const removedOptions = this.oldOptions
              .filter(old => !writtenOptions.find(option => old.id === option.id))
              .map(option => this.makeOption(option, true));
            this.productService.updateProduct(this.meeting.id, dto, addedOptions, removedOptions).subscribe(product => {
              alert('모임을 수정하였습니다.');
              this.passDeactivate = true;
              this.router.navigate(['./tabs/meeting-detail', product.id]);
              this.meetingForm.reset();
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

  makeOption(option: ProductOption, isOld: boolean) {
    const productOption = new ProductOptionCreateDto(option.name, +option.price, option.description,
      option.date, +option.minParticipants, +option.maxParticipants, isOld);
    if (option.id) productOption.id = option.id;
    return productOption;
  }
}
