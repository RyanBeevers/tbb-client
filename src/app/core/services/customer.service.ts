import { Injectable } from '@angular/core';
import { Customer } from './../models/customer.model'
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  customer: Customer = { };


  constructor() { }
  customer1: Customer = { };
  customer2: Customer = { };
  customer3: Customer = { };

  createCustomers(){
    this.customer1.customerId= 1
    this.customer1.firstName= "John"
    this.customer1.lastName= "Smith"
    this.customer1.email= "JohnSmith@yahoo.com"
    this.customer1.businessName="JS Company"
    this.customer1.typeOfBusiness="Construction"
    this.customer1.workPhone="123-456-7890"
    this.customer1.personalPhone="234-123-1234"
    this.customer1.businessStreetAddress="1234 Lane Drive"
    this.customer1.businessCity="Ruskin"
    this.customer1.businessState="Florida"
    this.customer1.businessZip="33570"
    this.customer1.businessCountry="USA"
    
    this.customer2.customerId= 2;
    this.customer2.firstName= "Jane"
    this.customer2.lastName= "Smith"
    this.customer2.email= "JaneSmith@yahoo.com"
    this.customer2.businessName="Janes Company"
    this.customer2.typeOfBusiness="Office"
    this.customer2.workPhone="123-456-7891"
    this.customer2.personalPhone="234-123-1224"
    this.customer2.businessStreetAddress="1234 Circle Drive"
    this.customer2.businessCity="Queen Creek"
    this.customer2.businessState="Arizona"
    this.customer2.businessZip="85142"
    this.customer2.businessCountry="USA"

    this.customer3.customerId= 2;
    this.customer3.firstName= "Sara"
    this.customer3.lastName= "Beevers"
    this.customer3.email= "SaraBeevers@yahoo.com"
    this.customer3.businessName="Saras Company"
    this.customer3.typeOfBusiness="Office"
    this.customer3.workPhone="124-456-7891"
    this.customer3.personalPhone="235-123-1224"
    this.customer3.businessStreetAddress="1334 Circle Drive"
    this.customer3.businessCity="Middletown"
    this.customer3.businessState="Ohio"
    this.customer3.businessZip="45044"
    this.customer3.businessCountry="USA"
  }
  getAllCustomers(){
    this.createCustomers();
    let customers = [];
    customers.push(this.customer1);
    customers.push(this.customer2);
    customers.push(this.customer3);
    return customers
  }
}
