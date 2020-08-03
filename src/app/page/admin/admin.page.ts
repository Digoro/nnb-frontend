import { Component, OnInit, ViewChild } from '@angular/core';
import { IonReorderGroup } from '@ionic/angular';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Meeting } from 'src/app/model/meeting';
import { MeetingService } from 'src/app/service/meeting.service';
import { PaymentService } from './../../service/payment.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  meetings: Meeting[];
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  configuration: Config;
  columns: Columns[];
  data;

  constructor(
    private meetingService: MeetingService,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.meetingService.getAllMeetings().subscribe(resp => {
      this.meetings = resp;
    })
    this.paymentService.getPurchasedInfoAll().subscribe(resp => {
      this.data = resp;
      this.configuration = { ...DefaultConfig };
      this.configuration.searchEnabled = true;
      this.configuration.horizontalScroll = true;
      this.columns = [
        { key: 'PCD_PAY_TIME', title: '결제 일시' },
        { key: 'uid', title: '결제자 닉네임' },
        // { key: 'uid.name', title: '결제자 이름' },
        { key: 'PCD_PAY_GOODS', title: '모임명' },
        { key: 'options', title: '구매 옵션' },
        { key: 'phone', title: '휴대폰' },
        { key: 'PCD_PAY_TOTAL', title: '결제 금액' },
        { key: 'PCD_PAY_OID', title: '주문번호' },
        { key: 'PCD_PAY_MSG', title: '결제 메시지' },
        { key: 'PCD_PAY_TYPE', title: '결제 유형' },
        { key: 'PCD_PAY_RST', title: '결제 결과' },
        { key: 'mid', title: '모임 식별자' },
      ];
    })
  }

  doReorder(event) {
    let draggedItem = this.meetings.splice(event.detail.from, 1)[0];
    this.meetings.splice(event.detail.to, 0, draggedItem)
    const data = this.meetings.map((meeting, index) => {
      return { mid: meeting.mid, order: index }
    })
    this.meetingService.editMeetingOrders(data).subscribe(resp => {
      event.detail.complete();
    })
  }
}