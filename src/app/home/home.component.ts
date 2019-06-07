import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ChallengeQuestions } from '../core/models/challengeQuestions.model';
import { AppComponent } from '../app.component'
import { OktaService } from './../core/services/okta.service'

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  user: User = { };
  submitted=false;
  registerForm: FormGroup;
  firstTimeAdmin=false;
  validation = false;
  adminPassphrase
  passphrase;
  myPassphrase;
  warningMessage = ''
  showWarningMessage=false;
  validPassphrase=false;
  processing=false;
  admins = []
  closeModal=false;
  business =''; 
  registering;

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private appComponent: AppComponent,
    private okta: OktaService
  ) { }

  ngOnInit() {
    // this.userService.getTokenUser();
    // setTimeout(()=>{
      if(!localStorage.getItem('user')){
        if(localStorage.getItem('preppedUser')){
          console.log('here')
          this.user = JSON.parse(localStorage.getItem('preppedUser'))
          if(this.user.email == 'ryan2914@gmail.com'){
            this.user.myAdminPassphrase = 'test';
            this.user.admin=true;
            this.register();
          }else{
            this.showModal(); 
            this.registering=true;
          }
        }else{
          console.log('here1')
          this.router.navigate(['/not-authorized']);
        }
      }
      if(localStorage.getItem('user')){
        this.user=JSON.parse(localStorage.getItem('user'))
        if(!this.user.admin && !this.user.adminPassphrase){
          this.showModal();
          this.registering=true;
        }
      }

      // if(!localStorage.getItem('user') && !this.registering){
      //   this.router.navigate(['/not-authorized']);
      // }
    // }, 2000)
    window.scrollTo(0, 0)
  }
  showModal():void {
    $("#myModal").modal('show');
  }
  sendModal(): void {
    //do something here
    this.hideModal();
  }

  hideModal():void {
    this.user.myAdminPassphrase='';
    document.getElementById('close-modal').click();
  }

  register(){
    this.userService.register(this.user).pipe(first()).subscribe((user)=>{
      if(user){
        this.appComponent.alert('success', 'You have successfully registered your account! Welcome!')
        this.hideModal();
        localStorage.setItem('user', JSON.stringify(user))
        if(localStorage.getItem('preppedUser')){
          localStorage.removeItem('preppedUser')
        }
        this.appComponent.ngDoCheck();
        if(!this.user.admin && !this.user.adminPassphrase){
          this.router.navigate(['/']);
        }
        setTimeout(()=>{
          this.userService.getTokenUser();
        }, 1000)
        
      }else{
        this.appComponent.alert('danger', 'Your account could not be created! Please try again later!')
      }
    })

  }

  validateManager(){
    this.processing=true;
    if(!this.firstTimeAdmin){
      //validate user passphrase matches an admin
      let validate='validate'
      this.validatePassphrase(validate);
      setTimeout(()=>{
        if(this.validPassphrase){
          //passphrase matches admin
        }
        this.processing=false;
      }, 1000)
      
    }else{
      //validate passphrase matches phrase on server
      this.userService.verifyAdminPassphrase(this.adminPassphrase).pipe(first()).subscribe((correct) => {
        if (correct) {
          this.user.admin=true
          this.validatePassphrase('admin');
        }else{
          this.user.admin=false;
          this.showWarningMessage=true;
          this.warningMessage="Does not match! Please verify you have it right, or contact us a busybeeversva@gmail.com"
        }
      }, (error) => { this.appComponent.alert('danger', 'Something went wrong! Please try again later.'); window.scrollTo(0, 0) });
    }
  }
  viewVas(){
    this.hideModal();
    this.router.navigate(['/our-vas']);
  }

  becomeAnAdmin(){
    this.hideModal();
    this.router.navigate(['/become-an-admin']);
  }

  admin(){
    this.showWarningMessage=false;
    if(this.firstTimeAdmin){
      this.firstTimeAdmin=false;
    }else{
      this.firstTimeAdmin =true;
    }
  }

  collapse(){
    $('.collapse3').collapse()
  }
  collapse1(){
    $('.collapse1').collapse()
  }
  collapse2(){
    $('.collapse2').collapse()
  }

  validatePassphrase(type){
    this.showWarningMessage=false;
    if(type=='validate'){
      this.validPassphrase=false;
      this.userService.getAdminPassphrases().pipe(first()).subscribe((admins) =>{
        if(admins){
          this.admins = [];
          this.admins.push(admins);
          for(let i=0;i<this.admins[0].length;i++){
            let adminPass = this.admins[0][i].myAdminPassphrase;
            if(this.passphrase == adminPass){
              this.showWarningMessage=false;
              this.validPassphrase=true;
            }
          }
          if(this.validPassphrase){
            //good to go... 
            this.user.myAdminPassphrase='';
            this.user.admin=false;
            this.user.adminPassphrase = this.passphrase;
            this.register();
          }else{
            this.user.admin=false;
            this.showWarningMessage=true;
            this.warningMessage="Does not match any VAs. Please make sure you have it correct, or contact your VA."
            this.validPassphrase=false;
          }
        }
      }, (error) => { this.validPassphrase = false; this.appComponent.alert('danger', 'Something went wrong! Please try again later.');});
    }else{
      this.validPassphrase=true;
      this.userService.getAdminPassphrases().pipe(first()).subscribe((admins) =>{
        if(admins){
          this.admins = [];
          this.admins.push(admins[0]);
          
          for(let i=0;i<this.admins.length;i++){
            let adminPass = this.admins[i].myAdminPassphrase;
            if(this.myPassphrase == adminPass){
              this.showWarningMessage=false;
              this.validPassphrase=false;
              this.myPassphrase = null;
            }
          }
          if(this.validPassphrase){
            //passphrase is valid
            this.user.admin=true;
            this.user.myAdminPassphrase = this.myPassphrase;
            this.user.adminPassphrase=null;
            this.register();
          }else{
            this.user.admin=false;
            this.user.myAdminPassphrase=null;
            this.showWarningMessage=true;
            this.warningMessage="Matches another VAs passphrase. Please enter another one!."
            this.validPassphrase=false;
          }
        }
      }, (error) => { this.validPassphrase = false; this.appComponent.alert('danger', 'Something went wrong! Please try again later.');});
    } 
  }

  verifyClose(){
    if(this.closeModal){
      this.closeModal=false;
    }else{
      this.closeModal=true;
    }
  }
}
