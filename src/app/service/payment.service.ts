import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { PaymentOptionMap, PaymentResult, PaymentSearchDto, PayMethod } from 'src/app/model/payment';
import { Coupon } from '../model/coupon';
import { UserPaymentInfo } from '../model/payment-user-info';
import { Product, ProductOption, PurchasedProduct, PurchasedProductOption } from '../model/product';
import { AlimtalkPaymentResult } from './../model/alimtalk-payment-result';
import { Pagination } from './../model/pagination';
import { Payment, PaymentCreateDto } from './../model/payment';
import { User } from './../model/user';
import { AlimtalkService } from './alimtalk.service';
import { UrlService } from './url.service';
declare var PaypleCpayAuthCheck;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  urlPrefix = UrlService.prefix;
  accounts = [
    // new UserBandkPaymentInfo('success', '0000', '회원조회 성공', 'transfer', '개인', 'NS9qNTgzU2xRNHR2RmFBWWFBTWk5UT09', '홍길동', '010-****-3333', '081', 'KEB하나은행', '123-********-021'),
    // new UserBandkPaymentInfo('success', '0000', '회원조회 성공', 'transfer', '개인', 'TS9qNTgzU2xRNHR2RmFBWWFBTWk5UT10', '홍길동', '010-****-2331', '081', '카카오뱅크', '231-********-982')
  ]
  constructor(
    private http: HttpClient,
    private router: Router,
    private alimtalkService: AlimtalkService
  ) { }

  getPayerIds(userId: number): Observable<{ pid: string, id: string }[]> {
    return this.http.get<{ pid: string, id: string }[]>(`/payment/payer_id?userId=${userId}`)
  }

  getUserPaymentAccountsByPid(pids: string[]): Observable<UserPaymentInfo[]> {
    const requests: Observable<any>[] = [];
    for (let pid of pids) {
      requests.push(this.http.get<UserPaymentInfo[]>(`/payment/user_info?pid=${pid}`))
    }
    if (requests.length === 0) return of([]);
    return forkJoin(requests);
    // return of(this.accounts).pipe(delay(1500))
  }

  getUserPaymentAccounts(userId: number): Observable<UserPaymentInfo[]> {
    return this.getPayerIds(userId).pipe(
      concatMap(resp => {
        const payerIds = resp.map(id => id.pid)
        return this.getUserPaymentAccountsByPid(payerIds)
      })
    )
  }

  getPurchasedInfo(userId: number): Observable<PaymentResult[]> {
    return this.http.get<PaymentResult[]>(`/payment/my_purchased?userId=${userId}`)
  }

  getPurchasedInfoAll(userId: number): Observable<PaymentResult[]> {
    let url = `${this.urlPrefix}/payments`;
    if (userId) url = `payments?userId=${userId}`;
    return forkJoin(
      this.http.get<PaymentResult[]>(url),
      this.http.get<PaymentResult[]>(`${this.urlPrefix}/paymentOptionMaps/`)
    ).pipe(
      map(data => {
        let payments = data[0];
        let maps: any[] = data[1];
        payments = payments.map(payment => {
          payment.options = maps.filter(map => map.payment.pid === payment.pid);
          return payment;
        })
        return payments;
      })
    )
  }

  add(account: UserPaymentInfo) {
    return this.http.post(`${this.urlPrefix}`, account)
  }

  delete(pid: string) {
    return this.http.delete(`/payment/payer_id?pid=${pid}`)
  }

  async writeDirectPayment(paymentResult: PaymentResult, options: ProductOption[], phoneNumber: string, user: User) {
    const result = await this.http.post<PaymentResult>(`${this.urlPrefix}/payments/`, paymentResult).toPromise()
    this.addPaymentOptionMaps(result.pid, options).subscribe(resp => {
      alert('결제 정보 입력 완료!');
    })
  }

  joinFreeMeeting(payment: PaymentCreateDto) {
    //TODO 알림톡 전송
    return this.http.post(`api/payments`, payment);
  }

  pay(method: PayMethod, user: User, meeting: Product, phoneNumber: string, price: number, options: any[], coupon: Coupon) {
    let obj = {};
    obj['PCD_CPAY_VER'] = "1.0.1";
    obj['payple_auth_file'] = "/api/payments/pg/auth";
    obj['PCD_PAY_GOODS'] = meeting.title;
    obj['PCD_PAY_TOTAL'] = price;
    obj['PCD_PAYER_NO'] = user.id;
    obj['PCD_PAYER_NAME'] = user.name;
    obj['PCD_PAYER_HP'] = user.phoneNumber;
    obj['PCD_PAYER_EMAIL'] = user.email;
    obj['PCD_PAY_WORK'] = "PAY";
    // obj['PCD_RST_URL'] = "https://nonunbub.com/api/payments/callback";
    obj['PCD_RST_URL'] = "http://localhost:8080/api/payments/callback";
    const userDefine = encodeURIComponent(JSON.stringify({
      phoneNumber, userId: user.id,
      mid: meeting.id,
      couponId: coupon ? coupon.id : '',
      options: options,
    }))
    obj['PCD_USER_DEFINE1'] = userDefine;
    switch (method) {
      // [from docs.payple.kr] 앱카드 결제
      // 카드 일반 결제 (다날 결제)
      case PayMethod.CARD: {
        obj['PCD_CARD_VER'] = "02"; // 카드 결제에만 쓰임
        obj['PCD_PAY_TYPE'] = "card";
        break;
      }
      // [from docs.payple.kr] 일회성 간편 결제
      // 계좌 일반 결제
      case PayMethod.TRANSFER: {
        obj['PCD_PAY_TYPE'] = "transfer";
        obj['PCD_TAXSAVE_FLAG'] = "N" // 계좌 결제에만 쓰임, 현금영수증 N
        break;
      }
    }
    PaypleCpayAuthCheck(obj);
  }

  addPaymentOptionMaps(pid: number, options: any[]) {
    const requests: Observable<any>[] = [];
    for (let option of options) {
      const map = new PaymentOptionMap(0, pid, option.id, +option.count)
      requests.push(this.http.post(`${this.urlPrefix}/paymentOptionMaps/`, map))
    }
    if (requests.length === 0) return of([]);
    return forkJoin(requests)
  }

  getPaymentOptionMaps(pid?: number, id?: number): Observable<any> {
    if (pid && id) {
      return this.http.get(`payment/payment_option_maps?pid=${pid}&oid=${id}`)
    } else if (pid) {
      return this.http.get(`payment/payment_option_maps?pid=${pid}`)
    } else if (id) {
      return this.http.get(`payment/payment_option_maps?oid=${id}`)
    }
  }

  getPaymentsCountByProduct(productId: number): Observable<number> {
    return this.http.get<number>(`/api/payments/by/host/${productId}`)
  }

  private sendAlimtalk(user: User, options: ProductOption[], result: PaymentResult, phoneNumber: string) {
    // TODO: 알림톡 시간 타임존 문제
    const payTime = moment(result.PCD_PAY_TIME, 'YYYYMMDDHHmmss').format('MM월 DD일 HH:mm');
    const optionDate = moment(options[0].date).format('MM월 DD일 HH:mm');
    const option = options.map(option => option.name).join(", ")
    let paymentResult = new AlimtalkPaymentResult(phoneNumber, user.nickname, user.nickname, result.PCD_PAY_OID, +result.PCD_PAY_TOTAL,
      payTime, result.PCD_PAY_GOODS, option, optionDate, result.mid)
    this.alimtalkService.sendPaymentResult(paymentResult).subscribe(resp => {
      console.log('구매자 알림톡 전송 완료');
      paymentResult.receiver_1 = '010-6687-1917';
      this.alimtalkService.sendPaymentResult(paymentResult).subscribe(resp => {
        console.log('관리자 알림톡 전송 완료');
        paymentResult.receiver_1 = '010-3250-7463';
        this.alimtalkService.sendPaymentResult(paymentResult).subscribe(resp => {
          console.log('관리자 알림톡 전송 완료');
        })
      })
    });
  }

  // 카드 혹은 계좌 등록
  auth(user: User, method: string, isAddedSource: BehaviorSubject<any>) {
    let obj = {};
    obj['PCD_CPAY_VER'] = "1.0.1";
    obj['PCD_PAYER_AUTHTYPE'] = "pwd";
    obj['PCD_PAY_TYPE'] = method; // transfer or card
    obj['PCD_PAY_WORK'] = "AUTH";
    obj['payple_auth_file'] = "/pg/auth";
    obj['PCD_PAYER_NO'] = user.id;
    obj['PCD_PAYER_NAME'] = user.name;
    obj['PCD_PAYER_HP'] = user.phoneNumber;
    obj['PCD_PAYER_EMAIL'] = user.email;
    obj['callbackFunction'] = (result: PaymentResult) => {
      console.log("AUTH 결과");
      console.log(result);
      if (result.PCD_PAY_RST === 'success' && result.PCD_PAY_MSG !== '기 인증고객 입니다.') {
        this.addPayerId(user.id, result.PCD_PAYER_ID).subscribe(resp => {
          isAddedSource.next('added');
        })
      }
      else alert('등록이 실패하였습니다.');
    };
    PaypleCpayAuthCheck(obj);
  }

  // 카드 혹은 계좌 등록 후 PCD_PAYER_ID 서버에 등록
  addPayerId(userId: number, payerId: string) {
    return this.http.post(`/payment/payer_id`, { userId: userId, payer_id: payerId })
  }

  // 결제 결과 저장
  addPaymentResult(result: PaymentResult) {
    return this.http.post(`/payment/callback`, result)
  }

  refund(meeting: PurchasedProduct, option: PurchasedProductOption) {
    //TODO: 환불 정책에 따라 PCD_REFUND_TOTAL 변경해야 함
    //TODO: 쿠폰 환불 해야함
    // const couponId = meeting.payment.couponId ? meeting.payment.couponId['couponId'] : undefined;
    if (+meeting.payment.PCD_PAY_TOTAL === 0) {
      return this.http.post('payment/refund', {
        pomid: option.pomid,
        pid: meeting.payment.pid,
        couponId: undefined,
        PCD_PAY_OID: meeting.payment.PCD_PAY_OID,
        PCD_PAY_DATE: moment().format("YYYYMMDD"),
        PCD_REFUND_TOTAL: option.price
      });
    } else {
      const tempOption = { ...option };
      const refundPolicy100 = meeting.payment.mid['refundPolicy100'];
      const refundPolicy0 = meeting.payment.mid['refundPolicy0'];
      const diff = Math.ceil(moment.duration(moment(tempOption.date).diff(moment())).asDays())

      if (diff >= refundPolicy100) tempOption.price = tempOption.price * tempOption.count;
      else if (diff > refundPolicy0 && diff < refundPolicy100) tempOption.price = tempOption.price * 0.5 * tempOption.count;
      else if (diff <= refundPolicy0) tempOption.price = 0;

      const isOk = confirm(`구매 옵션일 기준 ${diff}일 전입니다. 따라서 환불 정책에 의한 환불 금액은 ${tempOption.price}원 입니다. 계속 진행하시겠습니까?

  [환불 정책]
  - ${refundPolicy100}일 전: 결제 금액의 100%
  - ${refundPolicy0 + 1}일 전: 결제 금액의 50%
  - ${refundPolicy0}일 전 이후: 환불 불가
      `);
      if (isOk) {
        return this.http.post('payment/refund', {
          pomid: tempOption.pomid,
          pid: meeting.payment.pid,
          couponId: undefined,
          PCD_PAY_OID: meeting.payment.PCD_PAY_OID,
          PCD_PAY_DATE: moment().format("YYYYMMDD"),
          PCD_REFUND_TOTAL: tempOption.price
        });
      } else {
        return of()
      }
    }
  }

  getPurchasedProduct(paymentId: number): Observable<Payment> {
    return this.http.get<Payment>(`api/payments/owner/id/${paymentId}`);
  }

  getPurchasedProducts(search: PaymentSearchDto): Observable<Pagination<Payment>> {
    return this.http.get<Pagination<Payment>>(`api/payments/owner/search?page=${search.page}&limit=${search.limit}`);
  }

  getPaymentsByHost(search: PaymentSearchDto): Observable<Pagination<Payment>> {
    return this.http.get<Pagination<Payment>>(`api/payments/by/host?page=${search.page}&limit=${search.limit}`);
  }

  getPaymentsAll(search: PaymentSearchDto): Observable<Pagination<Payment>> {
    return this.http.get<Pagination<Payment>>(`api/payments?page=${search.page}&limit=${search.limit}`);
  }
}
