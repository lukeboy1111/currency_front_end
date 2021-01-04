import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef,  ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Currency } from '../model/currency';
import { CurrencyService } from 'src/app/service/currency.service';
import { Observable } from 'rxjs';
import { NumberFormatStyle } from '@angular/common';
import { Daily } from 'src/app/model/daily';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrenciesComponent implements OnInit {
  displayedColumns: string[] = ['currency', 'rate', 'edit'];
  selectedCurrency: Currency = new Currency();
  dataSource: MatTableDataSource<any>;
  loading = false;
  currencyData: Currency[] = [];
  
  selectedTheCurrency = false;
  
  calculatedAmount: number
  commentText: string
  
  @Input() conversionAmount: Observable<number>;

  constructor(
    private cd: ChangeDetectorRef,
    private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    console.log("in ngOnInit Starting");
    this.selectedCurrency = new Currency();
    this.commentText = "";
    this.calculatedAmount = 0;
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("in changes: Starting");
    // changes.prop contains the old and the new value...
    console.dir(changes);
  }

  async refresh() {
    //this.loading = true;
    console.log("Starting update");
    let dailyData = await this.currencyService.getCurrencies().then(function (data) {
      const daily = new Daily().deserialize(data);
      console.dir(daily);
      return daily;
    }) as Daily;
    
    
    //let data = await this.currencyService.getCurrencies();
    this.currencyData = dailyData.getRates()
    this.dataSource = new MatTableDataSource(this.currencyData);
    //this.dataSource.sort = this.sort;
    this.loading = false;
    console.log("END update loading="+this.loading)
    
  }

  async updateCurrency() {
    if (this.selectedCurrency.id !== undefined) {
      await this.currencyService.updateCurrency(this.selectedCurrency);
      
    } else {
      await this.currencyService.createCurrency(this.selectedCurrency);
    }
    this.selectedCurrency = new Currency();
    await this.refresh();
  }

  updateCalculation(item: number) {
    if (Number.isFinite(item) && this.selectedCurrency.id !== undefined) {
      this.calculatedAmount = this.selectedCurrency.rate * item;
    }
  }

  editCurrency(currency: Currency) {
    const amount = this.selectedCurrency.amount;
    const comment = this.selectedCurrency.comment;
    this.selectedCurrency = currency;
    this.selectedCurrency.amount = amount;
    this.selectedCurrency.comment = comment;
    if(Number.isFinite(this.selectedCurrency.amount)) {
      this.selectedCurrency.calculatedAmount = this.selectedCurrency.amount * this.selectedCurrency.rate;
    }
  }

  clearCurrency() {
    this.selectedCurrency = new Currency();
  }

  async deleteCurrency(currency: Currency) {
    //this.loading = true;
    if (confirm(`Are you sure you want to delete the currency ${currency.currency}. This cannot be undone.`)) {
      this.currencyService.deleteCurrency(currency.id);
    }
    await this.refresh();
  }
}