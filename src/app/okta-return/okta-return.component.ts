import { Component, OnInit } from '@angular/core';
import { OktaService } from './../core/services/okta.service'
import { Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-okta-return',
  templateUrl: './okta-return.component.html',
  styleUrls: ['./okta-return.component.scss']
})
export class OktaReturnComponent implements OnInit {
  ready=false;

  constructor(
    private okta: OktaService,
    private router: Router,
    private userService: UserService,
    private appComponent: AppComponent,
  ) {
    okta.handleAuthentication();
   }

  async ngOnInit() {
    setTimeout(()=>{
      this.userService.getTokenUser();
    },2000)
    setTimeout(()=>{
        this.router.navigate(['/home']);
    }, 6000);
  }

}
