import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlimtalkPaymentResult } from '../model/alimtalk-payment-result';

@Injectable({
  providedIn: 'root'
})
export class AlimtalkService {

  constructor(
    private http: HttpClient
  ) { }

  sendPaymentResult(result: AlimtalkPaymentResult) {
    return this.http.post('alimtalk/payment_result', result);
  }
}
