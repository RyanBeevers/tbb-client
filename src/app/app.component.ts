import { Component } from '@angular/core';
import { User } from './core/models/user.model'
import { UserService } from './core/services/user.service'
import { OktaService } from './core/services/okta.service';
import { first } from 'rxjs/operators';
import { isLContainer } from '@angular/core/src/render3/util';

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
  business;
  myAdmin;

  constructor(
    public userService: UserService,
    public oktaAuth: OktaService,
  ) { }
  
  ngOnInit(){
    this.isLoggedIn  = this.userService.isAuthenticated();
    this.userService.getTokenUser();
    setTimeout(()=>{
      if (localStorage.getItem('user')){
        this.user = JSON.parse(localStorage.getItem('user'));
        if(!this.user.admin && this.user.adminPassphrase){
          this.userService.getMyAdmin(this.user.adminPassphrase).pipe(first()).subscribe((admin) => {
            if(admin){
              localStorage.setItem('myAdmin', JSON.stringify(admin))
              this.business = admin.businessName
              this.myAdmin = admin;
            }
          });
        }
      }else{
        this.user={}
      }
      setTimeout(()=>{
        if(localStorage.getItem('myAdmin')){
          this.myAdmin = JSON.parse(localStorage.getItem('myAdmin'));
          this.business=this.myAdmin.businessName;
        }else if(this.user.admin){
          this.business=this.user.businessName;
        }else{
          this.business='The Busy Beevers'
        }
      }, 2000);
    },2000);
  }

  ngDoCheck(){
    if (localStorage.getItem('user')){
      this.user = JSON.parse(localStorage.getItem('user'));
    }else{
      this.user={}
    }
    if(localStorage.getItem('myAdmin')){
      this.myAdmin = JSON.parse(localStorage.getItem('myAdmin'));
      this.business=this.myAdmin.businessName;
    }else if(this.user.admin){
      this.business=this.user.businessName;
    }else{
      this.business='The Busy Beevers'
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
