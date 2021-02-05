import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { PaymentOptionMap, PaymentResult } from 'src/app/model/payment';
import { Coupon } from '../model/coupon';
import { PayMethod, UserPaymentInfo } from '../model/payment-user-info';
import { AlimtalkPaymentResult } from './../model/alimtalk-payment-result';
import { Meeting, MeetingOption, PurchasedMeeting, PurchasedMeetingOption } from './../model/meeting';
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

  getPayerIds(uid: number): Observable<{ pid: string, uid: string }[]> {
    return this.http.get<{ pid: string, uid: string }[]>(`/payment/payer_id?uid=${uid}`)
    // const data = this.accounts.map(a => {
    //   return { pid: a.PCD_PAYER_ID, uid: `${uid}` };
    // })
    // return of(data).pipe(delay(1500))
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

  getUserPaymentAccounts(uid: number): Observable<UserPaymentInfo[]> {
    return this.getPayerIds(uid).pipe(
      concatMap(resp => {
        const payerIds = resp.map(id => id.pid)
        return this.getUserPaymentAccountsByPid(payerIds)
      })
    )
  }

  getPurchasedInfo(uid: number): Observable<PaymentResult[]> {
    return this.http.get<PaymentResult[]>(`/payment/my_purchased?uid=${uid}`)
  }

  getPurchasedInfoAll(uid: number): Observable<PaymentResult[]> {
    let url = `${this.urlPrefix}/payments`;
    if (uid) url = `payments?uid=${uid}`;
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

  async writeDirectPayment(paymentResult: PaymentResult, options: MeetingOption[], phone: string, user: User) {
    const result = await this.http.post<PaymentResult>(`${this.urlPrefix}/payments/`, paymentResult).toPromise()
    this.addPaymentOptionMaps(result.pid, options).subscribe(resp => {
      alert('결제 정보 입력 완료!');
    })
  }

  async joinFreeMeeting(paymentResult: PaymentResult, options: MeetingOption[], phone: string, user: User) {
    const result = await this.http.post<PaymentResult>(`${this.urlPrefix}/payments/`, paymentResult).toPromise()
    this.addPaymentOptionMaps(result.pid, options).subscribe(resp => {
      alert('등록한 모임으로 이동합니다.');
      this.router.navigate(['/tabs/my-info']);
      this.sendAlimtalk(user, options, paymentResult, phone);
    })
  }

  pay(method: PayMethod, user: User, meeting: Meeting, phone: string, price: number, options: any[], coupon: Coupon) {
    let obj = {};
    obj['PCD_CPAY_VER'] = "1.0.1";
    obj['payple_auth_file'] = "/pg/auth";
    obj['PCD_PAY_GOODS'] = meeting.title;
    obj['PCD_PAY_TOTAL'] = price;
    obj['PCD_PAYER_NO'] = user.uid;
    obj['PCD_PAYER_NAME'] = user.name;
    obj['PCD_PAYER_HP'] = user.phone;
    obj['PCD_PAYER_EMAIL'] = user.email;
    obj['PCD_PAY_WORK'] = "PAY";
    obj['PCD_RST_URL'] = "https://nonunbub.com/payment/callback";
    const userDefine = encodeURIComponent(JSON.stringify({
      phone, uid: user.uid,
      mid: meeting.mid,
      couponId: coupon ? coupon.couponId : '',
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
      const map = new PaymentOptionMap(0, pid, option.oid, +option.optionCount)
      requests.push(this.http.post(`${this.urlPrefix}/paymentOptionMaps/`, map))
    }
    if (requests.length === 0) return of([]);
    return forkJoin(requests)
  }

  getPaymentOptionMaps(pid?: number, oid?: number): Observable<any> {
    if (pid && oid) {
      return this.http.get(`payment/payment_option_maps?pid=${pid}&oid=${oid}`)
    } else if (pid) {
      return this.http.get(`payment/payment_option_maps?pid=${pid}`)
    } else if (oid) {
      return this.http.get(`payment/payment_option_maps?oid=${oid}`)
    }
  }

  getPaymentsFromMeeting(mid: number): Observable<PaymentResult[]> {
    return this.http.get<PaymentResult[]>(`payment_by_meeting?mid=${mid}`)
  }

  private sendAlimtalk(user: User, options: MeetingOption[], result: PaymentResult, phone: string) {
    // TODO: 알림톡 시간 타임존 문제
    const payTime = moment(result.PCD_PAY_TIME, 'YYYYMMDDHHmmss').format('MM월 DD일 HH:mm');
    const optionDate = moment(options[0].optionDate).format('MM월 DD일 HH:mm');
    const option = options.map(option => option.optionTitle).join(", ")
    let paymentResult = new AlimtalkPaymentResult(phone, user.nickName, user.nickName, result.PCD_PAY_OID, +result.PCD_PAY_TOTAL,
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
    obj['PCD_PAYER_NO'] = user.uid;
    obj['PCD_PAYER_NAME'] = user.name;
    obj['PCD_PAYER_HP'] = user.phone;
    obj['PCD_PAYER_EMAIL'] = user.email;
    obj['callbackFunction'] = (result: PaymentResult) => {
      console.log("AUTH 결과");
      console.log(result);
      if (result.PCD_PAY_RST === 'success' && result.PCD_PAY_MSG !== '기 인증고객 입니다.') {
        this.addPayerId(user.uid, result.PCD_PAYER_ID).subscribe(resp => {
          isAddedSource.next('added');
        })
      }
      else alert('등록이 실패하였습니다.');
    };
    PaypleCpayAuthCheck(obj);
  }

  // 카드 혹은 계좌 등록 후 PCD_PAYER_ID 서버에 등록
  addPayerId(uid: number, payerId: string) {
    return this.http.post(`/payment/payer_id`, { uid: uid, payer_id: payerId })
  }

  // 결제 결과 저장
  addPaymentResult(result: PaymentResult) {
    return this.http.post(`/payment/callback`, result)
  }

  refund(meeting: PurchasedMeeting, option: PurchasedMeetingOption) {
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
        PCD_REFUND_TOTAL: option.optionPrice
      });
    } else {
      const tempOption = { ...option };
      const refundPolicy100 = meeting.payment.mid['refundPolicy100'];
      const refundPolicy0 = meeting.payment.mid['refundPolicy0'];
      const diff = Math.ceil(moment.duration(moment(tempOption.optionDate).diff(moment())).asDays())

      if (diff >= refundPolicy100) tempOption.optionPrice = tempOption.optionPrice * tempOption.count;
      else if (diff > refundPolicy0 && diff < refundPolicy100) tempOption.optionPrice = tempOption.optionPrice * 0.5 * tempOption.count;
      else if (diff <= refundPolicy0) tempOption.optionPrice = 0;

      const isOk = confirm(`구매 옵션일 기준 ${diff}일 전입니다. 따라서 환불 정책에 의한 환불 금액은 ${tempOption.optionPrice}원 입니다. 계속 진행하시겠습니까?
    
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
          PCD_REFUND_TOTAL: tempOption.optionPrice
        });
      } else {
        return of()
      }
    }
  }

  cancle(payment: PaymentResult) {
    payment.mid = payment.mid['mid'];
    payment.uid = payment.uid['uid'];
    return this.http.put(`${this.urlPrefix}/payments/${payment.pid}/`, payment);
  }
}
