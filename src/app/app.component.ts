import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Currency Display and Conversion';
  isAuthenticated: boolean;
  constructor(public oktaAuth: OktaAuthService) {
    this.oktaAuth.$isAuthenticated.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
    );
  }

  ngOnInit(): void {
    this.oktaAuth.$isAuthenticated.subscribe(val => this.isAuthenticated = val);
  }
}