import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Meeting, MeetingOption, MeetingStatus } from '../model/meeting';
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

  editMeetingStatus(mid: number, status: MeetingStatus) {
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
            if (moment(a.optionTo).isBefore(b.optionTo)) return -1
            else if (moment(a.optionTo).isAfter(b.optionTo)) return 1;
            else return 0;
          })
        data[0].options = options;
        return data[0];
      })
    )
  }

  getAllMeetings(status: MeetingStatus): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`/bmeetings?status=${status}`).pipe(
      map(meetings => meetings.reverse()),
      map(meetings => meetings.filter(meeting => {
        return !meeting.title.includes('동양 전통채색화 그리기 클래스') &&
          !meeting.title.includes('테스트') &&
          !meeting.title.includes('아름다움은 세상을 어떻게 변화시키는가?') &&
          !meeting.title.includes('락앤롤 아트 투어 중구 북촌편') &&
          !meeting.title.includes('락앤롤 아트 투어 인사동편')
      }))
    )
  }

  getMyMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`/mymeetings`);
  }

  deleteMeeting(mid: number) {
    return this.http.delete(`${this.urlPrefix}/meetings/${mid}`);
  }

  getPurchasedMeetings(uid: number) {
    return this.paymentService.getPurchasedInfo(uid).pipe(
      concatMap(info => {
        const requests = info.map(p => this.paymentService.getPaymentOptionMaps(p.pid).toPromise())
        if (requests.length === 0) return of([]);
        return forkJoin(requests);
      })
    )
  }
}