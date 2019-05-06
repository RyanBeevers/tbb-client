import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { InvoiceService } from './../core/services/invoice.service'
import { Invoice } from './../core/models/invoice.model'

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit {
  user: User = {};
  invoice: Invoice = {};
  customer: User={};
  
  constructor(
    private userService: UserService,
    private router: Router,
    private invoiceService: InvoiceService,
  ) { }
  
  today = new Date();
  nextweek = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()+7);
  payByDate = (this.nextweek.getMonth()+1)+'/'+(this.nextweek.getDate())+'/'+this.nextweek.getFullYear();
  
  task = {}
  tasks = []

  ngOnInit() {
    window.scrollTo(0, 0)
    if(!this.userService.isAuthenticated()){
      this.router.navigate(['/not-authorized']);
    }else{
      this.user=JSON.parse(localStorage.getItem('user'))
    }
    this.invoice=JSON.parse(localStorage.getItem('invoice'))
    localStorage.removeItem('invoice');
    this.customer=this.invoice.user;
  }
  pay(){
    // if(this.admin){
    //   this.admin=false;
    // }else{
    //   this.paid=true;
    // }
  }


}
