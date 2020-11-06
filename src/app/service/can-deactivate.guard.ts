import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MeetingControl } from './../page/meeting-add/meeting-control';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<MeetingControl> {
  canDeactivate(component: MeetingControl): boolean {
    if (!component.passDeactivate && component.meetingForm.dirty) {
      return confirm("페이지를 이동하시면 변경사항이 저장되지 않습니다. 그래도 이동하시겠습니까?");
    } else {
      return true;
    }
  }
}