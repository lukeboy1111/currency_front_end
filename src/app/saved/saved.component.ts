import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef,  ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Currency } from '../model/currency';
import { DataService } from 'src/app/service/data.service';
import { Observable } from 'rxjs';
import { NumberFormatStyle } from '@angular/common';
import { Daily } from 'src/app/model/daily';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.css']
})
export class SavedComponent implements OnInit {
  displayedColumns: string[] = ['id', 'sourceCurrency', 'sourceAmount', 'destinationCurrency', 'calculatedAmount', 'rateSource'];
  selectedCurrency: Currency = new Currency();
  dataSource: MatTableDataSource<any>;
  loading = false;
  currencyData: Currency[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private dataService: DataService
  ) { }

  ngOnInit() {
    console.log("in ngOnInit Starting");
    this.selectedCurrency = new Currency();
    this.refresh();
  }

  async refresh() {
    this.loading = true;
    let data = await this.dataService.getCurrenciesHistory();
    //this.currencyData = dailyData.getRates()
    this.dataSource = new MatTableDataSource(data);
    this.cd.markForCheck();
    this.loading = false;
    console.log("END update loading="+this.loading)
    
  }

}
