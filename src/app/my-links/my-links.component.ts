import { Component, OnInit } from '@angular/core';
import { User } from '../core/models/user.model';
import { UserService } from '../core/services/user.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-my-links',
  templateUrl: './my-links.component.html',
  styleUrls: ['./my-links.component.scss']
})
export class MyLinksComponent implements OnInit {
  user: User ={};
  errorMessage;

  constructor(
    private userService: UserService,
    private router: Router,
    private appComponent: AppComponent,

  ) { }

  ngOnInit() {
    if(localStorage.getItem('user')){
      this.user=JSON.parse(localStorage.getItem('user'))
      if(!this.userService.isAuthenticated || !this.user.admin){
        this.router.navigate(['/not-authorized']);
      }
    }
  }

  submit(){
    this.errorMessage=undefined;
    
    if(
      !this.user.myWebsite &&
      !this.user.facebook &&
      !this.user.instagram &&
      !this.user.youtube &&
      !this.user.linkedIn &&
      !this.user.twitter
    ){
      this.errorMessage="*Please enter at least one link before hitting submit!"
    }else{
      this.userService.updateUser(this.user).pipe(first()).subscribe((user) => {
        if(user){
          this.user = user;
          localStorage.removeItem('user')
          localStorage.setItem('user', JSON.stringify(this.user));
          this.appComponent.alert('success', 'Your account has been updated!')
        }
      }, (error) => { this.appComponent.alert('danger', 'Error updating Users! Please try again later!') });
    }
  }

}
