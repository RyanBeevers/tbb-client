import { Component, OnInit } from '@angular/core';
import { User } from '../core/models/user.model';
import { ChallengeQuestions } from '../core/models/challengeQuestions.model';
import { UserService } from '../core/services/user.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from '../core/helpers/must-match.validator';
import { first } from 'rxjs/operators';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  
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
  userChallengeAnswers;
  userAnsweredChallengeAnswers=[];
  formType;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private appComponent: AppComponent,
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.formType=localStorage.getItem('formType');
    if(this.formType=='change'){
      this.formName="Change"
      this.showChange=true;
      this.user=JSON.parse(localStorage.getItem('user'))
    }else{
      this.formName="Forgot"
      this.showChange=false;
      this.getChallengeQuestions();
    }

    this.user=JSON.parse(localStorage.getItem('user'));
    this.userService.getUserByEmail(this.user).pipe(first()).subscribe((user) => {
      if (user) {
        this.user=user;
      };
    }, (error) => { this.appComponent.alert('danger', 'Something went wrong! Please try again later.'); window.scrollTo(0, 0) });
    if(this.showChange){
      this.registerForm = this.formBuilder.group({
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],

      }, {
        validator: MustMatch('newPassword', 'confirmPassword')
      });
    }else{
      this.registerForm = this.formBuilder.group({
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      }, {
        validator: MustMatch('newPassword', 'confirmPassword')
      });
    }
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    if(this.showChange){
      if(this.password != this.user.password){
        this.appComponent.alert('warning', 'Old password does  not match current password!');
        return;
      }
      else if(this.newPassword == this.password){
        this.appComponent.alert('warning', 'New password cannot be the same as old password!');
        return;
      }
      else{
        this.updateProfile();
      }
    }else{
      if(this.newPassword == this.user.password){
        this.appComponent.alert('warning', 'New password cannot be the same as old password!');
        return;
      }
      else if (!this.userAnsweredChallengeAnswers[0] || !this.userAnsweredChallengeAnswers[1]){
        this.appComponent.alert('warning', 'Please fill in all Security Question answers!')
      }
      else if (this.userAnsweredChallengeAnswers[0].toLowerCase() != this.userChallengeAnswers[0].toLowerCase()){
        this.appComponent.alert('warning', 'Question 1 answer does not match our system')
      }
      else if (this.userAnsweredChallengeAnswers[1].toLowerCase() != this.userChallengeAnswers[1].toLowerCase()){
        this.appComponent.alert('warning', 'Question 2 answer does not match our system')
      }
      else{
        this.appComponent.closeAlert();
        this.updateProfile();
      }
    }
  }
  updateProfile(){
    this.user.password = this.newPassword;
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
        this.appComponent.alert('success', 'Password has been updated!');
        window.scrollTo(0, 0)
        localStorage.removeItem('formType');
        localStorage.removeItem('userId')
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
        this.challengeQuestions = challengeQuestions;
        this.userChallengeQuestions = [
          this.challengeQuestions[0].challengeQuestion,
          this.challengeQuestions[1].challengeQuestion,
        ];
        this.userChallengeAnswers = [
          this.challengeQuestions[0].challengeAnswer,
          this.challengeQuestions[1].challengeAnswer,
        ]
      };
    }, (error) => { this.appComponent.alert('danger', 'Unable to retrieve challenge questions! Please try again later.'); window.scrollTo(0, 0) });
  }

  cancel(){
    if(this.formName=='Change'){
      this.router.navigate(['/my-account'])
    }else{
      this.router.navigate(['/logout'])
    }
  }
}
