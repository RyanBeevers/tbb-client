import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model'
import { Service } from './../core/models/service.model'
import { UserService } from '../core/services/user.service';
import { ServiceService } from '../core/services/service.service';
import { first } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-our-vas',
  templateUrl: './our-vas.component.html',
  styleUrls: ['./our-vas.component.scss']
})
export class OurVasComponent implements OnInit {

  user: User = {};
  service: Service = {};

  admins = [];
  services = [];

  constructor(
    private userService: UserService,
    private serviceService: ServiceService,
    private appComponent: AppComponent,
    private router: Router,
  ) { }

  ngOnInit() {
    if(localStorage.getItem('user')){
      this.user=JSON.parse(localStorage.getItem('user'))
    }

    if(this.user.firstName && !this.user.admin){
      this.appComponent.alert('warning', 'You Already Have a VA!');
      this.router.navigate(['/home']);
    }
    window.scrollTo(0,0);
    this.userService.getAdminPassphrases().pipe(first()).subscribe((admins) => {
      if (admins) {
        this.admins.push(admins)
        this.getServices();
      }
    }, (error) => { this.appComponent.alert('danger', 'Error is retrieving Services! Please try again later') });
  }

  getServices(){
    for(let i=0; i<this.admins[0].length; i++){
        this.serviceService.getServices(this.admins[0][i].userId).pipe(first()).subscribe((services) => {
          if (services) {
            for (let j=0; j<this.admins[0].length;j++){
              if(services[0]){
                if(this.admins[0][j].userId == services[0].adminId){
                  this.services[i] = services
                }
              }
            }
          }
        }, (error) => { this.appComponent.alert('danger', 'Error is retrieving Services! Please try again later') });
    }
  }

}
