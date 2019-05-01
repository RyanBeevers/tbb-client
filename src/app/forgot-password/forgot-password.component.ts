import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { ChallengeQuestions } from './../core/models/challengeQuestions.model';
import { UserService } from './../core/services/user.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from './../core/helpers/must-match.validator';
import { first } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { parse } from 'url';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  
  registerForm: FormGroup;
  submitted = false;
  user: User = { };
  challengeQuestions: ChallengeQuestions = { };
  showChange=false;
  password;
  verifyPassword;
  newPassword;
  formName;
  userChallengeQuestions;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private appComponent: AppComponent,
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.user=this.userService.getUser();
    let formType=localStorage.getItem('formType');
    if(formType=='change'){
      this.formName="Change"
      this.showChange=true;
    }else{
      this.formName="Forgot"
      this.showChange=false;
      this.getChallengeQuestions();
    }
    this.registerForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],

    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    if(this.showChange){
      this.verifyPassword=this.user.password;
      if(this.password!=this.verifyPassword){
        window.scrollTo(0, 0);
        this.appComponent.alert('warning', 'Old password does not match current password');
      }
      if (this.password == this.newPassword){
        window.scrollTo(0, 0);
        this.appComponent.alert('warning', 'You cannot use the same password as currently set password!');
      }
      this.submitted = true;
      // stop here if form is invalid
      if (this.registerForm.invalid || this.password != this.verifyPassword || this.password == this.newPassword) {
        return;
      }else{
        this.user.password= this.newPassword
        this.updateProfile();
      }
    }else{
      console.log('challenge questions')
    }
  }
  updateProfile(){
    this.userService.updateUser(this.user).pipe(first()).subscribe((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.appComponent.alert('success', 'Password has been updated!');
        window.scrollTo(0, 0)
        localStorage.removeItem('formType');
        this.router.navigate(['/my-account']);
      };
    }, (error) => { this.appComponent.alert('danger', 'Something went wrong! Please try again later.'); window.scrollTo(0, 0) });
  }

  getChallengeQuestions(){
    let userId=localStorage.getItem('userId');
    let user: User = { } ;
    user.userId=parseInt(userId);

    this.userService.getChallengeQuestions(user).pipe(first()).subscribe((challengeQuestions) => {
      if (challengeQuestions) {
        console.log(challengeQuestions);
        this.challengeQuestions = challengeQuestions;
      };
    }, (error) => { this.appComponent.alert('danger', 'Unable to retrieve challenge questions! Please try again later.'); window.scrollTo(0, 0) });
  }
}
