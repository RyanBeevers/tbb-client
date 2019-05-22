import { Component, OnInit } from '@angular/core';
import { OktaService } from './../core/services/okta.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-okta-return',
  templateUrl: './okta-return.component.html',
  styleUrls: ['./okta-return.component.scss']
})
export class OktaReturnComponent implements OnInit {

  constructor(
    private okta: OktaService,
    private router: Router,
  ) {
    okta.handleAuthentication();
   }

  ngOnInit() {
    setTimeout(()=>{
      this.router.navigate(['/home']);
    }, 1000)
    
  }

}
