import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  user: User = {};
  submitted=false;
  registerForm: FormGroup;
  showConfirmCancel=false;
  showErrorMessage=false;
  errorMessage='';
  
  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0)
    if(localStorage.getItem('user')){
      this.user = JSON.parse(localStorage.getItem('user'))
      if(this.user.firstTimeLogIn){
          $("#myModal").modal('show');
        }
      }
    if(!this.userService.isAuthenticated()){
      this.router.navigate(['/not-authorized']);
    }
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      businessName: ['', Validators.required],
      businessPhone: ['', Validators.required],
      businessAddress: ['', Validators.required],
      businessCity: ['', Validators.required],
      businessZip: ['', Validators.required],
      businessState: ['', Validators.required],
      businessCountry: ['', Validators.required],
    });
  }
  
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
  }
  
  register(){
    this.userService.register(this.user).pipe(first()).subscribe((user) => {
      if (user) {
        this.hideModal();
        localStorage.setItem('user', JSON.stringify(user));
      };
    }, (error) => { this.showErrorMessage=true; this.errorMessage="Username or Password is incorrect! Please try again." });
  }
  confirmCancel(){
    this.showConfirmCancel=true;
  }
  hideWarning(){
    this.showConfirmCancel=false;
  }
  cancelAndReturn(){
    this.hideModal();
    this.userService.setUser=null;
    localStorage.removeItem('user');
    this.router.navigate(['/']);

  }

  sendModal(): void {
    //do something here
    this.hideModal();
  }

  hideModal():void {
    document.getElementById('close-modal').click();
  }

}
