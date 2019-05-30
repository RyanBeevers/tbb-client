import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service'
import { AppComponent } from '../app.component';
import { OktaService } from './../core/services/okta.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  user: User = {};
  constructor(
    public userService: UserService,
    private appComponent: AppComponent,
    public oktaService: OktaService,
  ) {}

  alreadyTexted = false;
  username = undefined;
  showLogInWarningMessage = false;
  showAlreadySent = false;

  ngOnInit() {
    window.scrollTo(0, 0)
    // if (localStorage.getItem('user')){
    //   this.user = this.userService.getUser();
    //   this.alreadyTexted = this.user.alreadyTexted;
    //   this.username = this.user.email;
    // }else{
    //   this.user=undefined;
    // }
  }

  showLogInWarning(){
    this.showLogInWarningMessage = true;
  }

  alreadySentText(){
    this.showAlreadySent = true;
  }

  closeWarnings(){
    this.showLogInWarningMessage = false;
    this.showAlreadySent = false;
  }

  login(){
    this.oktaService.login();
  }
}

