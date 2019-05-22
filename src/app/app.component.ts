import { Component } from '@angular/core';
import { User } from './core/models/user.model'
import { UserService } from './core/services/user.service'
import { OktaService } from './core/services/okta.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'thebusybeevers';
  user: User = { };
  isLoggedIn = false;
  showAlert=false;
  messageClass='';
  iconClass='';
  messageHeader='';
  messageMessage='';
  closeAlertTimeout;

  constructor(
    private userService: UserService,
    public oktaAuth: OktaService
  ) { }
  
  ngOnInit(){
    this.isLoggedIn  = this.userService.isAuthenticated();
  }
  ngDoCheck(){
    if (localStorage.getItem('user')){
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  alert(messageClass, message){
    clearTimeout(this.closeAlertTimeout)
    window.scrollTo(0, 0)
    this.showAlert=true;
    this.messageClass='';
    if(messageClass=='danger'){
      this.messageClass = 'alert alert-danger alert-dismissible fade show';
      this.messageHeader = 'Uh-Oh!'
      this.iconClass = 'fas fa-exclamation-triangle'
    }
    if(messageClass=='success'){
      this.messageClass = 'alert alert-success alert-dismissible fade show';
      this.messageHeader = 'Success!'
      this.iconClass = 'fas fa-check-circle'
    }
    if(messageClass=='warning'){
      this.messageClass = 'alert alert-warning alert-dismissible fade show';
      this.messageHeader = 'Warning!'
      this.iconClass = 'fas fa-exclamation-triangle'
    }
    this.messageMessage=message;
    this.closeAlertTimeout = setTimeout(()=>{
      this.closeAlert();
    }, 7000);
  }
  closeAlert(){
    this.messageClass='';
    this.messageHeader='';
    this.messageMessage='';
    this.iconClass='';
    this.showAlert=false;
  }
}
