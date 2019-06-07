import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-become-an-admin',
  templateUrl: './become-an-admin.component.html',
  styleUrls: ['./become-an-admin.component.scss']
})
export class BecomeAnAdminComponent implements OnInit {

  changeText1;
  changeText2;
  changeText3;
  changeText4;
  linkYourAccounts=false;
  manageTasks=false;
  createInvoices=false;
  linkUsers=true;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    window.scrollTo(0,0);
  }

  users(){
    this.linkUsers=true;
    this.createInvoices=false;
    this.linkYourAccounts=false;
    this.manageTasks=false;
  }

  tasks(){
    this.linkUsers=false;
    this.createInvoices=false;
    this.linkYourAccounts=false;
    this.manageTasks=true;
  }

  invoices(){
    this.linkUsers=false;
    this.createInvoices=true;
    this.linkYourAccounts=false;
    this.manageTasks=false;
  }

  accounts(){
    this.linkUsers=false;
    this.createInvoices=false;
    this.linkYourAccounts=true;
    this.manageTasks=false;
  }

}
