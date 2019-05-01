import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { Customer } from './../core/models/customer.model'
import { CustomerService } from './../core/services/customer.service'

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {
  user: User = {};
  customer: Customer = {};
  customers =[]
  
  constructor(
    private userService: UserService,
    private router: Router,
    private customerService: CustomerService,
  ) { }

  admin = true;
  invoiceId;
  today = new Date();
  dateOfIssue = (this.today.getMonth()+1)+'/'+this.today.getDate()+'/'+this.today.getFullYear();
  
  //mock task
  description;
  cost;
  effort;

  taskTotal;
  subtotal=0;
  discount=0;
  total=0;
  nextweek = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()+7);
  payByDate = (this.nextweek.getMonth()+1)+'/'+(this.nextweek.getDate())+'/'+this.nextweek.getFullYear();
  task = {}
  tasks = []

  selectedBusinessName;

  getAllCustomers(){
    this.customers = this.customerService.getAllCustomers();
  }

  setCustomer(){
    for(let i=0;i<this.customers.length;i++){
      if (this.customers[i].businessName == this.selectedBusinessName){
        this.customer=this.customers[i]
        break;
      }
    }
    console.log(this.customer)
  }

  addTask() {
    if(!this.cost || this.cost==0  || this.effort==0 || !this.effort || !this.description){
      return;
    }
    this.taskTotal=this.cost*this.effort;
    this.task = {
      'description': this.description,
      'cost': this.cost,
      'effort': this.effort,
      'total': this.taskTotal,
    };
    this.tasks.push(this.task)
    this.subtotal=0;
    for (let i=0;i<this.tasks.length;i++){
      this.subtotal+=(this.tasks[i].total);
    }
    this.total=this.subtotal-this.discount;
    this.total.toFixed(2);
    this.description='';
    this.cost='';
    this.effort='';
    
  }

  calculate(){
    this.total=this.subtotal-this.discount;
    this.total.toFixed(2)
  }
  ngOnInit() {
    window.scrollTo(0, 0)
    this.admin=this.userService.isAdmin();
    if(!this.userService.isAuthenticated() || !this.admin){
      this.router.navigate(['/not-authorized']);
    }else{
      this.user=this.userService.getUser();
      this.admin=this.userService.isAdmin();
      this.getAllCustomers();
      console.log(this.customers)
    }
  }

}
