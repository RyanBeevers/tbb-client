import { Component, OnInit } from '@angular/core';
import { User } from '../core/models/user.model';
import { UserService } from '../core/services/user.service';
import { Router } from '@angular/router';
import { ServiceService } from '../core/services/service.service';
import { Service } from '../core/models/service.model';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AppComponent } from '../app.component';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-new-service',
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.scss']
})
export class NewServiceComponent implements OnInit {
  user: User = {};
  service: Service = {};
  registerForm: FormGroup;
  submitted = false;
  editMode=false;
  
  constructor(
    private serviceService: ServiceService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private appComponent: AppComponent
    ) { }  

  ngOnInit() {
    window.scrollTo(0, 0)
    if(!this.userService.isAuthenticated()){
      this.router.navigate(['/not-authorized']);
    }
    if(localStorage.getItem('selectedService')){
      this.service = JSON.parse(localStorage.getItem('selectedService'))
      localStorage.removeItem('selectedService');
      this.editMode=true;
    }
    this.user = JSON.parse(localStorage.getItem('user'));
    this.service.adminId=this.user.userId;
    this.registerForm = this.formBuilder.group({
      serviceTitle: ['', [Validators.required]],
      serviceImg: ['', [Validators.required]],
      serviceDesc: ['', [Validators.required]],
      servicePricingDetail: ['', [Validators.required]],
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    if(this.editMode){
      this.updateService();
    }else{
      this.newService();
    }
  }

  newService(){
    this.serviceService.newService(this.service).pipe(first()).subscribe((service) => {
      if (service) {
        this.appComponent.alert('success', 'Service Successfully Added! YAY!')
        this.router.navigate(['/services']);
      }else{
        this.appComponent.alert('danger', 'Something went wrong... Please try again later!')
      };
    }, (error) => { this.appComponent.alert('danger', 'There was a problem adding your new service! Please try again later!') });
  }

  updateService(){
    this.serviceService.updateService(this.service).pipe(first()).subscribe((service) => {
      if (service) {
        this.appComponent.alert('success', 'Service Updated Added! YAY!')
        this.router.navigate(['/services']);
      }else{
        this.appComponent.alert('danger', 'Something went wrong... Please try again later!')
      };
    }, (error) => { this.appComponent.alert('danger', 'There was a problem updating your service! Please try again later!') });
  }
  
  showModal():void {
    $("#myModal").modal('show');

  }
  sendModal(): void {
    this.hideModal();
  }
  hideModal():void {
    document.getElementById('close-modal').click();
  }

}
