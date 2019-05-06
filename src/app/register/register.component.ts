import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from './../core/helpers/must-match.validator';
import { first } from 'rxjs/operators';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  user: User = {};
  errorMessage;
  showLink=false;
  modalShown=false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0)
    if (localStorage.getItem('user')) {
      this.user=(JSON.parse(localStorage.getItem('user')))
      this.router.navigate(['/home']);
    }
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.userService.getEmail(this.user).pipe(first()).subscribe((user) => {
      if (user) {
        this.errorMessage="Email address is already in use. Please try a different one or try logging in ";
        this.showLink = true;
      }else{
        this.showLink=false;
        this.errorMessage='';
        this.user.firstTimeLogIn=true;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.router.navigate(['/home']);
      };
    }, (error) => { this.errorMessage="Something went wrong! Please try again later." });
  }
  
  sendModal(): void {
    //do something here
    this.hideModal();
  }
  hideModal():void {
    document.getElementById('close-modal').click();
  }
}
