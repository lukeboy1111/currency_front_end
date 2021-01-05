import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef,  ChangeDetectionStrategy } from '@angular/core';
import { Currency } from '../model/currency';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.css']
})
export class SavedComponent implements OnInit {
  loading = false;
  loadedData: Currency[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private dataService: DataService
  ) { }

  ngOnInit() {
    console.log("in ngOnInit Starting");
    this.refresh();
  }

  async refresh() {
    this.loading = true;
    this.loadedData = await this.dataService.getCurrenciesHistory();
    this.loading = false;
    console.log("END update loading="+this.loading)
    
  }

}
