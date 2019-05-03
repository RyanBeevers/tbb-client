import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  user: User = {};
  email: '';
  password: '';
  showErrorMessage=false;
  errorMessage;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }


  ngOnInit() {
    window.scrollTo(0, 0)
    if (localStorage.getItem('user')) {
      this.user=(JSON.parse(localStorage.getItem('user')))
      this.router.navigate(['/home']);
    }
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.login();
  }

  login() {
    this.user.email = this.email;
    this.user.password = this.password;
    this.userService.login(this.user).pipe(first()).subscribe((user) => {
      if (user) {
        let currentUser={
          "email": user.email,
          "firstName": user.firstName,
          "lastName": user.lastName,
          "roleType": user.roleType,
          "userId": user.userId,
          "alreadyTexted": user.alreadyTexted,
          "firstTimeLogin": user.firstTimeLogIn
        }
        localStorage.setItem('user', JSON.stringify(currentUser));
    };
    this.router.navigate(['/home']);
    }, (error) => { this.showErrorMessage=true; this.errorMessage="Username or Password is incorrect! Please try again." });
  }
  closeMessage(){
    this.errorMessage='';
    this.showErrorMessage=false;
  }
  setForgotPassword(){
    this.user.email = this.email;
    this.userService.getUserByEmail(this.user).pipe(first()).subscribe((user) => {
      if (user) {
        localStorage.setItem("formType", "forgot");
        localStorage.setItem('userId', JSON.stringify(user.userId));
        this.router.navigate(['/forgot-password']);
      }else{
        console.log('no user... do something')
      };
    }, (error) => { this.showErrorMessage=true; this.errorMessage="Username or Password is incorrect! Please try again." });

  }
}
