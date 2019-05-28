import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';

@Component({
  selector: 'app-contact-me',
  templateUrl: './contact-me.component.html',
  styleUrls: ['./contact-me.component.scss']
})
export class ContactMeComponent implements OnInit {
  user: User = {};
  admin: User = {};
  facebook;
  twitter;
  email;
  instagram;
  youtube;
  myWebsite;
  linkedIn;

  constructor(

  ) { }

  ngOnInit() {
    window.scrollTo(0, 0)
    if(localStorage.getItem('user')){
      this.user=JSON.parse(localStorage.getItem('user'))
    }else{
      this.user.admin=false;;
    }
    if(!this.user.admin){
      if(localStorage.getItem('myAdmin')){
        this.admin = JSON.parse(localStorage.getItem('myAdmin'))
      }else{
        this.admin={};
      }
    }
    if(this.user.admin){
      this.email=this.user.email;
      this.facebook = this.user.facebook;
      this.twitter = this.user.twitter;
      this.linkedIn = this.user.linkedIn;
      this.youtube = this.user.youtube;
      this.instagram = this.user.instagram;
      this.myWebsite = this.user.myWebsite
    }
    else if (this.admin.userId){
      this.email=this.admin.email;
      this.facebook = this.admin.facebook;
      this.twitter = this.admin.twitter;
      this.linkedIn = this.admin.linkedIn;
      this.youtube = this.admin.youtube;
      this.instagram = this.admin.instagram;
      this.myWebsite = this.admin.myWebsite
    }
    else{
      this.email="thebusybeeversva@gmail.com"
      this.facebook="https://www.facebook.com/Busy-Beevers-Virtual-Assistant-577507756093532/"
      this.linkedIn="https://www.linkedin.com/in/sara-beevers-34b1a7159/"
    }
  }

}
