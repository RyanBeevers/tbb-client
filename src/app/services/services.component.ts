import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { ServiceService } from '../core/services/service.service';
import { Service } from '../core/models/service.model'
import { first } from 'rxjs/operators';
import { AppComponent } from './../app.component'

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  
  user: User = {};
  service: Service = {};
  admin; 
  services = [];
  selectedService: Service ={};
  showVerification=false;
  showProcessing=false;

  constructor(
    private serviceService: ServiceService,
    private userService: UserService,
    private router: Router,
    private appComponent: AppComponent,
    ) { }

  ngOnInit() {
    window.scrollTo(0, 0)
    if(this.userService.isAuthenticated()){
      this.user=JSON.parse(localStorage.getItem('user'));
    }
    this.loadServices();
  }

  loadServices(){
    this.services = [];
    let adminId;
    if(!this.user.admin){
      let admin=JSON.parse(localStorage.getItem('myAdmin'))
      adminId = admin.userId
    }else{
      adminId = this.user.userId;
    }
    this.serviceService.getServices(adminId).pipe(first()).subscribe((services) => {
      if (services) {
        this.services.push(services)
        if(!this.services[0] || !this.services[0][0]){
          this.appComponent.alert('warning', 'No Services Currently Available')
        }
      }
    }, (error) => { this.appComponent.alert('danger', 'Error is retrieving services! Please try again later') });
  }

  showModal(i):void {
    this.selectedService = this.services[0][i];
        $("#myModal").modal('show');
  }
  sendModal(): void {
    this.hideModal();
  }
  hideModal():void {
    document.getElementById('close-modal').click();
  }

  showVerificationDiv(){
    if(!this.showVerification){
      this.showVerification=true;
    }else{
      this.showVerification=false;
    }
  }

  editCard(){
    localStorage.setItem('selectedService', JSON.stringify(this.selectedService))
    this.hideModal();
    this.router.navigate(['/new-service']);
  }

  deleteCard(){
    this.serviceService.deleteService(this.selectedService).pipe(first()).subscribe((success) => {
      this.showProcessing=true;
      if (success) {
        setTimeout(()=>{
          this.showVerification=false;
          this.showProcessing=false;
          this.appComponent.alert('success', 'Service Successfully Deleted')
          this.hideModal();
          this.loadServices();
     }, 1000);
      }else{
        this.showVerification=false;
        this.appComponent.alert('danger', 'Service not deleted!')
        this.showProcessing=false;
        this.hideModal();
      };
    }, (error) => { this.appComponent.alert('danger', 'Error is deleting service! Please try again later') });
  }
}
