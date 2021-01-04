import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Currency } from '../model/currency';
import { HistoryService } from 'src/app/service/history.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistoryComponent implements OnInit {

  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<CurrencyInfo>>;

  columnsToDisplay = ['theDate'];
  innerDisplayedColumns = ['currency', 'rate'];
  expandedElement: CurrencyHolder | null;
  selectedCurrency: Currency = new Currency();
  dataSource: MatTableDataSource<any>;
  loading = false;
  currencyData: Currency[] = [];
  
  constructor(
    private cd: ChangeDetectorRef,
    private historyService: HistoryService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    this.loading = true;
    const data = await this.historyService.getCurrenciesHistory();
    data.forEach(currencyItem => {
      if (currencyItem.listCurrencies && Array.isArray(currencyItem.listCurrencies) && currencyItem.listCurrencies.length) {
        this.currencyData = [...this.currencyData, { ...currencyItem, listCurrencies: new MatTableDataSource(currencyItem.listCurrencies) }];
      } else {
        this.currencyData = [...this.currencyData, currencyItem];
      }
    });
    this.dataSource = new MatTableDataSource(this.currencyData);
    this.dataSource.sort = this.sort;
    this.loading = false;
  }

  toggleRow(element: CurrencyHolder) {
    element.listCurrencies && (element.listCurrencies as MatTableDataSource<CurrencyInfo>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<CurrencyInfo>).sort = this.innerSort.toArray()[index]);
  }

  applyFilter(filterValue: string) {
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<CurrencyInfo>).filter = filterValue.trim().toLowerCase());
  }
}

export interface CurrencyHolder {
  theDate: string;
  listCurrencies?: CurrencyInfo[] | MatTableDataSource<CurrencyInfo>;
}

export interface CurrencyInfo {
  id: string;
  currency: string;
  rate: number;
}

export interface UserDataSource {
  currency: string;
  addresses?: MatTableDataSource<CurrencyInfo>;
}