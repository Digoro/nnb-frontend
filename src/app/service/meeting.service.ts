import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Meeting, MeetingStatus } from '../model/meeting';
import { MeetingOption, PurchasedMeeting } from './../model/meeting';
import { PaymentService } from './payment.service';
import { UrlService } from './url.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  urlPrefix = UrlService.prefix;

  constructor(
    private http: HttpClient,
    private utilService: UtilService,
    private paymentService: PaymentService
  ) { }

  addMeeting(formData: FormData): Observable<Meeting> {
    return this.http.post<Meeting>(`${this.urlPrefix}/meetings/`, formData)
  }

  addMeetingOptions(mid: number, options: MeetingOption[]) {
    const requests: Observable<any>[] = [];
    options.forEach(option => {
      return requests.push(this.http.post(`${this.urlPrefix}/meetingOptions/`, option))
    })
    if (requests.length === 0) return of([]);
    return forkJoin(requests);
  }

  removeMeetingOptions(options: MeetingOption[]) {
    const requests: Observable<any>[] = [];
    options.forEach(option => {
      return requests.push(this.http.delete(`${this.urlPrefix}/meetingOptions/${option.oid}`))
    })
    if (requests.length === 0) return of([]);
    return forkJoin(requests);
  }

  editMeetingOptions(options: MeetingOption[]) {
    const requests: Observable<any>[] = [];
    options.forEach(option => {
      return requests.push(this.http.put(`${this.urlPrefix}/meetingOptions/${option.oid}/`, option))
    })
    if (requests.length === 0) return of([]);
    return forkJoin(requests);
  }

  editMeeting(mid: number, formData: FormData): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.urlPrefix}/meetings/${mid}/`, formData)
  }

  editMeetingOrders(orders: { mid: number, order: number }[]) {
    const requests: Observable<any>[] = [];
    orders.forEach(order => {
      return requests.push(this.http.post('/admin/meetings/order', order))
    })
    if (requests.length === 0) return of([]);
    return forkJoin(requests);
  }

  updateMeetingStatus(mid: number, status: MeetingStatus) {
    return this.http.post(`/admin/meetings/status`, { mid, status })
  }

  searchMeetings(queries: string[]): Observable<Meeting[]> {
    queries.push("status=3")
    const queryString = queries.join('&')
    return this.http.get<Meeting[]>(`/bmeetings?${queryString}`)
  }

  getMeeting(id: number): Observable<Meeting> {
    return forkJoin(
      this.http.get<Meeting>(`${this.urlPrefix}/meetings/${id}`),
      this.http.get<MeetingOption[]>(`/meetingOptions?mid=${id}`)
    ).pipe(
      map(data => {
        let options: MeetingOption[] = data[1];
        options = options
          .filter(option => !option.isOld)
          .sort((a, b) => {
            if (moment(a.optionDate).isBefore(b.optionDate)) return -1
            else if (moment(a.optionDate).isAfter(b.optionDate)) return 1;
            else return 0;
          })
        data[0].options = options;
        return data[0];
      })
    )
  }

  getAllMeetings(status: MeetingStatus): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`/bmeetings?status=${status}`).pipe(
      map(meetings => meetings.reverse())
    )
  }

  getHostedMeetings(): Observable<Meeting[]> {
    // return this.getAllMeetings(MeetingStatus.ENTERED);
    return this.http.get<Meeting[]>(`/hosted_meetings`);
  }

  deleteMeeting(mid: number) {
    return this.http.delete(`${this.urlPrefix}/meetings/${mid}`);
  }

  getPurchasedMeeting(pid: number): Observable<PurchasedMeeting> {
    return this.paymentService.getPaymentOptionMaps(pid).pipe(
      map(maps => {
        return {
          payment: maps[0].payment,
          options: maps.map(payment => {
            return {
              ...payment.option,
              pomid: payment.pomid,
              count: payment.count,
              PCD_PAY_REFUND_CARDRECEIPT: payment.PCD_PAY_REFUND_CARDRECEIPT,
              PCD_REFUND_TOTAL: payment.PCD_REFUND_TOTAL,
              isRefund: payment.isRefund
            }
          })
        }
      })
    )
  }

  getPurchasedMeetings(uid: number): Observable<PurchasedMeeting[]> {
    return this.paymentService.getPurchasedInfo(uid).pipe(
      concatMap(info => {
        const requests = info.map(p => this.paymentService.getPaymentOptionMaps(p.pid).toPromise())
        if (requests.length === 0) return of([]);
        return forkJoin(requests);
      }),
      map(payments => {
        return payments.map(paymentList => {
          return {
            payment: paymentList[0].payment,
            options: paymentList.map(payment => {
              return {
                ...payment.option,
                pomid: payment.pomid,
                count: payment.count,
                PCD_PAY_REFUND_CARDRECEIPT: payment.PCD_PAY_REFUND_CARDRECEIPT,
                PCD_REFUND_TOTAL: payment.PCD_REFUND_TOTAL,
                isRefund: payment.isRefund
              }
            })
          }
        })
      })
    )
  }

  getStatusLabel(status) {
    switch (status) {
      case MeetingStatus.ALL: return "전체";
      case MeetingStatus.CREATED: return "생성";
      case MeetingStatus.INSPACTED: return "검토";
      case MeetingStatus.ENTERED: return "전시";
      case MeetingStatus.UPDATED: return "수정";
      case MeetingStatus.DISABLED: return "비활성";
      case MeetingStatus.COMPLETED: return "완료";
      case MeetingStatus.DELETED: return "삭제";
    }
  }
}