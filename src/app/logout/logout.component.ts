import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { OktaService } from '../core/services/okta.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
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
    if(localStorage.getItem('timeout')){
      this.userService.logout();
      this.okta.loggingOut=false;
      localStorage.removeItem('timeout');
      this.router.navigate(['/session-expired'])
    }else{
      this.userService.logout();
      this.okta.loggingOut=false;
      this.router.navigate(['/']);
    }
    
  }

}
