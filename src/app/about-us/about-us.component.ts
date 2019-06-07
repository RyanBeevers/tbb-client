import { Component, OnInit } from '@angular/core';
import { OktaService } from '../core/services/okta.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(
    private okta: OktaService,
  ) { }

  ngOnInit() {
    window.scrollTo(0,0);
  }

  login(){
    this.okta.login();
  }
}
