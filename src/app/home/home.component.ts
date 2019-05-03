import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ChallengeQuestions } from '../core/models/challengeQuestions.model';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  user: User = { };
  challengeQuestion1: ChallengeQuestions = { }
  challengeQuestion2: ChallengeQuestions = { }
  submitted=false;
  registerForm: FormGroup;
  showConfirmCancel=false;
  showErrorMessage=false;
  errorMessage='';

  challengeQuestions =[
    'What Is your favorite book?',
    'What is the name of the road you grew up on?',
    'What is your mother’s maiden name?',
    'What was the name of your first/current/favorite pet?',
    'What was the first company that you worked for?',
    'Where did you meet your spouse',
    'Where did you go to high school/college?',
    'What is your favorite food?',
    'What city were you born in?',
    'Where is your favorite place to vacation?',
    'What is your fathers middle name?'
  ];
  question1='Please Choose One...';
  question2='Please Choose One...';
  sameQuestion = false;; 
  question1Warning=false;
  question2Warning=false;
  challengeAnswer1;
  challengeAnswer2;

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
      challengeAnswer1: ['', Validators.required],
      challengeAnswer2: ['', Validators.required],
    });
  }
  
  get f() { return this.registerForm.controls; }

  onSubmit() {


  }
  
  register(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    if(this.question1=="Please Choose One..."){
      this.question1Warning=true;
      return;
    }
    if(this.question2=="Please Choose One..."){
      this.question2Warning=true;
      return;
    }
    
    this.userService.register(this.user).pipe(first()).subscribe((user) => {
      if (user) {
        this.hideModal();
        localStorage.setItem('user', JSON.stringify(user));
        this.user=user;
        let challenges = [];
        let challengeQuestion1 = {
          "question" : this.question1,
          "answer" : this.challengeAnswer1,
          "custId": this.user.userId
        }
        let challengeQuestion2 = {
          "question" : this.question2,
          "answer" : this.challengeAnswer2,
          "custId": this.user.userId
        }
        challenges.push(challengeQuestion1, challengeQuestion2)
        this.userService.setChallengeQuestions(challenges[0]).pipe(first()).subscribe((challengeQuestion) => {
          if (challengeQuestion) {
            console.log('yay')
          }}, (error) => { this.showErrorMessage=true; this.errorMessage="sumthin happened" });
          this.userService.setChallengeQuestions(challenges[1]).pipe(first()).subscribe((challengeQuestion) => {
            if (challengeQuestion) {
              console.log('yay')
            }}, (error) => { this.showErrorMessage=true; this.errorMessage="sumthin happened" });
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

  setQuestion1(index){
    this.question1Warning=false;
    this.showErrorMessage=false;
    this.sameQuestion=false;
    this.question1 = this.challengeQuestions[index];
    if(this.question1==this.question2 && this.question2!="Please Choose One..."){
      this.sameQuestion=true;
      this.question1="Please Choose One..."
    }else{
      this.sameQuestion=false;
      this.question1 = this.challengeQuestions[index];
    }
  }
  setQuestion2(index){
    this.question2Warning=false;
    this.showErrorMessage=false;
    this.sameQuestion=false;
    this.question2 = this.challengeQuestions[index];
    if(this.question1==this.question2 && this.question1!="Please Choose One..."){
      this.sameQuestion=true;
      this.question2="Please Choose One..."
    }else{
      this.sameQuestion=false;
      this.question2 = this.challengeQuestions[index];
    }
  }

}
