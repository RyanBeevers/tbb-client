import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from './../core/helpers/must-match.validator';
import { first } from 'rxjs/operators';
import { AppComponent } from '../app.component';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  user: User = {};
  password;

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private appComponent: AppComponent,
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    if(!this.userService.isAuthenticated()){
      this.router.navigate(['/not-authorized']);
    }else{
      this.user=JSON.parse(localStorage.getItem('user'));
      this.userService.getUserByEmail(this.user).pipe(first()).subscribe((user) => {
        if (user) {
          this.user=user;
        };
      }, (error) => { this.appComponent.alert('danger', 'Something went wrong! Please try again later.'); window.scrollTo(0, 0) });
    }
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      businessName: ['', Validators.required],
      businessPhone: ['', Validators.required],
      businessAddress: ['', Validators.required],
      businessCity: ['', Validators.required],
      businessZip: ['', Validators.required],
      businessState: ['', Validators.required],
      businessCountry: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword'),
  });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
  }

  updateProfile(){
    this.userService.updateUser(this.user).pipe(first()).subscribe((user) => {
      if (user) {
        let secureUser: User = {
          "userId": user.userId,
          "firstName": user.firstName,
          "lastName": user.lastName,
          "roleType": user.roleType,    
          "email": user.email,
          "alreadyTexted": user.alreadyTexted,
          "firstTimeLogIn": user.firstTimeLogIn,
        }
        localStorage.setItem('user', JSON.stringify(secureUser));
        this.appComponent.alert('success', 'Account has been updated!');
        window.scrollTo(0, 0)
      };
    }, (error) => { this.appComponent.alert('danger', 'Something went wrong! Please try again later.'); window.scrollTo(0, 0) });
  }
  setPasswordChange(){
    localStorage.setItem("formType", "change");
    this.router.navigate(['/reset-password']);
  }
}
