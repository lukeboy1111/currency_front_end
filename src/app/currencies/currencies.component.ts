import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Currency } from '../model/currency';
import { SaveCurrency } from '../model/savecurrency';
import { CurrencyService } from 'src/app/service/currency.service';
import { NumberFormatStyle } from '@angular/common';
import { Daily } from 'src/app/model/daily';
import { Constants } from 'src/app/model/constants';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {
  dynamicForm: FormGroup;
  submitted = false;
  selectedCurrency: Currency = new Currency();
  loading = false;
  currencyData: Currency[] = [];
  
  sourceCurrency: string 
  calculatedAmount: number
  targetedCurrencyDisplay: string
  sourceCurrencyDisplay: string
  amountInputted: number
  commentText: string
  destinationCurrencyRate: number
  saveMessageEnabled: boolean
  
  
  constructor(
    private formBuilder: FormBuilder,
    private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    console.log("in ngOnInit Starting");
    
    this.dynamicForm = this.formBuilder.group({
      amount: ['', Validators.required, Validators.min],
      sourceCurrency: ['', Validators.required],
      targetCurrency: ['', Validators.required],
      currencies: new FormArray([])
    });
    this.saveMessageEnabled = false;
    this.amountInputted = 0;
    this.sourceCurrencyDisplay = "";
    this.targetedCurrencyDisplay = "";
    this.destinationCurrencyRate = 0;
    this.selectedCurrency = new Currency();
    this.sourceCurrency = "";
    this.commentText = "";
    this.calculatedAmount = 0;
    this.refresh();
    this.loading = false
    console.log("END INIT")
  }

  // convenience getters for easy access to form fields
  get f() { return this.dynamicForm.controls; }
  get t() { return this.f.currencies as FormArray; }
  get currencyFormGroups() { return this.t.controls as FormGroup[]; }

  onChangeCurrency(e) {
    const theCurrencySelected = e.target.value || "";
    if (theCurrencySelected === "") {
      this.t.push(this.formBuilder.group({
        sourceCurrency: ['', Validators.required]
      }));  
    }
    this.sourceCurrencyDisplay = theCurrencySelected;
    this.calculatedAmount = this.currencyService.calculateAmount(this.amountInputted, this.sourceCurrencyDisplay, this.targetedCurrencyDisplay)
  }

  onChangeTargetCurrency(e) {
    const theCurrencySelected = e.target.value || "";
    if (theCurrencySelected === "") {
      this.t.push(this.formBuilder.group({
        targetCurrency: ['', Validators.required]
      }));  
    }
    this.targetedCurrencyDisplay = theCurrencySelected;
    this.destinationCurrencyRate = this.currencyService.getRateForCurrency(this.targetedCurrencyDisplay)
    this.calculatedAmount = this.currencyService.calculateAmount(this.amountInputted, this.sourceCurrencyDisplay, this.targetedCurrencyDisplay)
  }

  onChangeNotes(e) {
    const commentSelected = e.target.value || "";
    this.commentText = commentSelected;
  }

  onChangeAmount(e) {
    const amountConversion = e.target.value || 0;
    if (!Number.isFinite(amountConversion)) {
      this.t.push(this.formBuilder.group({
        amount: ['', Validators.required]
      }));
    }
    this.amountInputted = amountConversion
    this.calculatedAmount = this.currencyService.calculateAmount(this.amountInputted, this.sourceCurrencyDisplay, this.targetedCurrencyDisplay)
  }

  async saveItems() {
    if (this.amountInputted <= 0) {
      this.t.push(this.formBuilder.group({
        amount: ['', Validators.required]
      }));
      return;
    } 
    if (this.sourceCurrencyDisplay === "") {
      this.t.push(this.formBuilder.group({
        sourceCurrency: ['', Validators.required]
      }));
      return;
    }
    if (this.targetedCurrencyDisplay === "") {
      this.t.push(this.formBuilder.group({
        targetCurrency: ['', Validators.required]
      })); 
      return;
    }
    this.submitted = true;
    let currencySave = new SaveCurrency();
    currencySave.amount = this.amountInputted;
    currencySave.calculatedAmount = this.calculatedAmount;
    currencySave.source = Constants.ECB;
    currencySave.currency = this.targetedCurrencyDisplay;
    currencySave.sourceCurrency = this.sourceCurrencyDisplay;
    currencySave.rate = this.destinationCurrencyRate
    currencySave.comment = this.commentText
    console.log("amount = " + this.amountInputted);
    console.dir(currencySave);
    await this.currencyService.saveCurrency(currencySave);
    // display form values on success
    this.saveMessageEnabled = true;
    this.submitted = false;
    
  }

  onReset() {
    // reset whole form back to initial state
    this.submitted = false;
    this.saveMessageEnabled = true;
    this.dynamicForm.reset();
    this.t.clear();
  }

  async refresh() {
    this.loading = true;
    let dailyData = await this.currencyService.getCurrencies() as Daily;
    this.currencyData = dailyData.getRates()
    console.log("END REFRESH")
    this.loading = false;
    
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