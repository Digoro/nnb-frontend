import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MeetingControlComponent } from '../component/meeting-control/meeting-control.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<MeetingControlComponent> {
  canDeactivate(component: MeetingControlComponent): boolean {
    if (confirm("페이지를 이동하시면 변경사항이 저장되지 않습니다. 그래도 이동하시겠습니까?")) {
      return true;
    } else {
      return false;
    }
  }
}