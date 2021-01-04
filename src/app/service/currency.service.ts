import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../model/currency';
import { OktaAuthService } from 'src/app/app.service';
import { Daily } from 'src/app/model/daily';
import {map} from 'rxjs/operators';

const baseUrl = 'http://localhost:4201';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
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

  getCurrencies() {
    console.log('call would be to ' + `${baseUrl}/api/v1/currency/today/`)
    /*
    const data = this.request('get', `${baseUrl}/api/v1/currency/today/`).then(function (data) {
      const daily = new Daily().deserialize(data);
      console.dir(daily);
      return daily;
    }
    );
    */
    const data = this.request('get', `${baseUrl}/api/v1/currency/today/`);
    return data;
    
  }

  getCurrency(id: string) {
    return this.request('get', `${baseUrl}/currency/${id}`);
  }

  createCurrency(currency: Currency) {
    console.log('createcurrency ' + JSON.stringify(currency));
    return this.request('post', `${baseUrl}/currency`, currency);
  }

  updateCurrency(currency: Currency) {
    console.log('updatecurrency ' + JSON.stringify(currency));
    return this.request('post', `${baseUrl}/currency/${currency.id}`, currency);
  }

  deleteCurrency(id: string) {
    return this.request('delete', `${baseUrl}/currency/${id}`);
  }
}