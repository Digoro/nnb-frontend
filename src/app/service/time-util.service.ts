import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TimeUtilService {

  constructor() { }

  static getNow() {
    return moment(new Date()).format('YYYY-MM-DDThh:mm:ss');
  }
}
