import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../model/currency';
import { SaveCurrency } from '../model/savecurrency';
import { OktaAuthService } from 'src/app/app.service';
import { Daily } from 'src/app/model/daily';
import { Constants } from 'src/app/model/constants';
import {map} from 'rxjs/operators';

const baseUrl = 'http://localhost:4201';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private token: string
  private dailyData: Daily
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

  calculateAmount(amount: number, sourceCurrency: string, targetCurrency: string) :number {
    console.log("Called with "+amount+" source="+sourceCurrency+" target="+targetCurrency)
    if (amount <= 0) {
      console.log("number is not finite, return 0")
      return 0;
    }
    if (sourceCurrency === "") {
      return 0;
    }
    if (targetCurrency === "") {
      return 0;
    }
    console.log("Here")
    let convertedAmount = amount;
    if (!(sourceCurrency === Constants.EUR)) {
      convertedAmount = this.convertToEUR(amount, sourceCurrency);
    }
    convertedAmount = this.convertToCurrency(convertedAmount, targetCurrency)
    console.log("convertedAmount=" + convertedAmount)
    return convertedAmount
  }

  convertToEUR(amount: number, sourceCurrency: string): number {
    let rates = this.dailyData.rates;
    let convertedCalcAmount = amount;
    for (let i = 0; i < rates.length; i++) {
      let currentRate = rates[i];
      if (currentRate.currency === sourceCurrency) {
        convertedCalcAmount = amount / currentRate.rate
      }
    }
    return convertedCalcAmount;
  }

  convertToCurrency(amount: number, targetCurrency: string): number {
    let rates = this.dailyData.rates;
    let convertedCalcAmount = amount;
    for (let i = 0; i < rates.length; i++) {
      let currentRate = rates[i];
      if (currentRate.currency === targetCurrency) {
        convertedCalcAmount = amount * currentRate.rate
      }
    }
    return convertedCalcAmount;
  }

  getRateForCurrency(targetCurrency: string): number {
    let rates = this.dailyData.rates;
    let convertedCalcAmount = 0;
    for (let i = 0; i < rates.length; i++) {
      let currentRate = rates[i];
      if (currentRate.currency === targetCurrency) {
        convertedCalcAmount = currentRate.rate
      }
    }
    return convertedCalcAmount;
  }

  async getCurrencies() {
    console.log('call would be to ' + `${baseUrl}/api/v1/currency/today/`)
    this.dailyData = await this.loadCurrencies().then(function (data) {
      const daily = new Daily().deserialize(data);
      console.dir(daily);
      return daily;
    }) as Daily;
    
    return this.dailyData;
    
  }

  async loadCurrencies() {
    const data = this.request('get', `${baseUrl}/api/v1/currency/today/`);  
    return data
  }

  getCurrency(id: string) {
    return this.request('get', `${baseUrl}/currency/${id}`);
  }

  createCurrency(currency: Currency) {
    console.log('createcurrency ' + JSON.stringify(currency));
    return this.request('post', `${baseUrl}/currency`, currency);
  }

  saveCurrency(currency: SaveCurrency) {
    console.log('updatecurrency ' + JSON.stringify(currency));
    return this.request('post', `${baseUrl}/api/v1/data/save/`, currency);
  }

  deleteCurrency(id: string) {
    return this.request('delete', `${baseUrl}/currency/${id}`);
  }
}