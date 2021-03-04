import { MapsAPILoader } from '@agm/core';
import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HashtagCreateDto, HashtagType, ProductCreateDto } from 'src/app/model/product';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/meeting.service';
import { S3Service } from 'src/app/service/s3.service';
import { FormService } from '../../service/form.service';
import { ProductOptionCreateDto, ProductRepresentationPhotoCreateDto, ProductStatus } from './../../model/product';
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
    private productService: ProductService
  ) {
    super(mapsAPILoader, ngZone, s3Service);
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
      this.loadMap();
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
  }

  loadMap() {
    this.mapsAPILoader.load().then(() => {
      this.latitude = this.SEOUL_LATITUDE;
      this.longitude = this.SEOUL_LONGITUDE;
      this.zoom = 12;
    });
  }

  add() {
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
            const productOptions = options.map(option => {
              return new ProductOptionCreateDto(option.name, +option.price, option.description,
                option.date, +option.minParticipants, +option.maxParticipants, option?.isOld)
            })

            const dto = new ProductCreateDto(title, point, recommend, description, address, detailAddress, minutes,
              location.lat(), location.lng(), +price, +discountPrice, notice, checkList, includeList, excludeList,
              refundPolicy100, refundPolicy0, 0, ProductStatus.CREATED,
              hashtagNames, categories, productOptions, [new ProductRepresentationPhotoCreateDto(fileSource, 0)])
            this.productService.addProduct(dto).subscribe(product => {
              alert('모임을 생성하였습니다.');
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
}
