import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../model/currency';
import { OktaAuthService } from 'src/app/app.service';

const baseUrl = 'http://localhost:4201';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private token: string
  constructor(private http: HttpClient, public oktaAuth: OktaAuthService ) {
  }

  private async request(method: string, url: string, data?: any) {
    const token = await this.oktaAuth.getAccessToken();
    const result = this.http.request(method, url, {
      body: data,
      responseType: 'json',
      observe: 'body',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return new Promise<any>((resolve, reject) => {
      result.subscribe(resolve as any, reject as any);
    });
  }

  getCurrenciesHistory() {
    console.log('call would be to '+`${baseUrl}/api/v1/currency/history/`)
    return this.request('get', `${baseUrl}/api/v1/currency/history/`);
  }

  
}