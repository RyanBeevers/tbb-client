import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
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
  user: User = {};
  selectedFiles: FileList;

  constructor(
    private userService: UserService,
    private router: Router,
    private appComponent: AppComponent,
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    if(!this.userService.isAuthenticated()){
      this.router.navigate(['/not-authorized']);
    }else{
      this.user=JSON.parse(localStorage.getItem('user'));
    }
  }

}
