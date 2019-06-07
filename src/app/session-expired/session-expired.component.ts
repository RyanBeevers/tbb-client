import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { OktaService } from '../core/services/okta.service';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss']
})
export class SessionExpiredComponent implements OnInit {
  user: User = { };

  constructor(
    private okta: OktaService,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit() {
    if(localStorage.getItem('myAdmin')){
      localStorage.removeItem('myAdmin')
    }
    this.userService.logout();
    this.okta.loggingOut=false;
  }

  login(){
    this.okta.login()
  }
}
