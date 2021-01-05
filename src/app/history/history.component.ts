import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Daily } from 'src/app/model/daily';
import { HistoryService } from 'src/app/service/history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  dynamicForm: FormGroup;
  loading = false;
  loadedData;
  selectedData: Daily;
  selected: Boolean;
  
  constructor(
    private formBuilder: FormBuilder,
    private historyService: HistoryService
  ) { }

  ngOnInit() {
    this.selected = false;
    this.dynamicForm = this.formBuilder.group({
      theDate: ['', Validators.required]
    });
    this.refresh();
  }

  async refresh() {
    this.loading = true;
    const data = await this.historyService.getCurrenciesHistory();
    this.loadedData = data;
    this.loading = false;
  }

  onChangeDate(e) {
    console.dir(e);
    const theDateSelected = e.target.value || "";
    console.log("Comparing " + theDateSelected);
    for (let i = 0; i < this.loadedData.length; i++) {
      let theDateData = this.loadedData[i];
      let scopedData = new Daily();
      scopedData.deserialize(theDateData);
      if (scopedData.theDate === theDateSelected) {
        this.selectedData = scopedData;
        this.selected = true;
      }
    }
  }
  
}
