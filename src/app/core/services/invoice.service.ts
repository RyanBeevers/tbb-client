import { Injectable } from '@angular/core';
import { Invoice } from './../models/invoice.model'
import { Task } from './../models/task.model'

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  task: Task = {};
  invoice: Invoice = {};

  constructor() { }
  
  invoice1: Invoice = { };
  invoice2: Invoice = { };
  invoice3: Invoice = { };
  
  invoices = [];
  today = new Date();

  populateInvoices(){
    this.invoice1.customerId = 1;
    this.invoice1.invoiceId = 1
    this.invoice1.invoiceDateOfIssue = this.today;
    this.invoice1.invoiceDiscount = 186
    this.invoice1.invoiceTotal = 198
    this.invoice1.invoicePayByDate = this.today;
    this.invoice1.invoicePaidDate = this.today
    this.invoice1.invoicePaidFlag = true;
    this.invoice1.taskIds = [1,2,3];
    
    this.invoice2.customerId = 2;
    this.invoice2.invoiceId = 2
    this.invoice2.invoiceDateOfIssue = this.today;
    this.invoice2.invoiceDiscount = 0
    this.invoice2.invoiceTotal = 200
    this.invoice2.invoicePayByDate = this.today;
    this.invoice2.invoicePaidDate;
    this.invoice2.invoicePaidFlag = false;
    this.invoice2.taskIds = [4,5,6];

    this.invoice3.customerId = 2;
    this.invoice3.invoiceId = 3
    this.invoice3.invoiceDateOfIssue = this.today;
    this.invoice3.invoiceDiscount = 50
    this.invoice3.invoiceTotal = 350
    this.invoice3.invoicePayByDate = this.today;
    this.invoice3.invoicePaidDate = this.today
    this.invoice3.invoicePaidFlag = true;
    this.invoice3.taskIds = [7,8,9];

    this.invoices.push(this.invoice1, this.invoice2, this.invoice3);
  }
  setInvoice(invoice){
    this.invoice=invoice;
  }
  
  getInvoice(){
    return this.invoice;
  }

  getAllInvoices(){
    this.invoices=[];
    this.populateInvoices();
    return this.invoices
  }

  getInvoiceById(invoiceId){
    this.invoices=[];
    this.populateInvoices();
    for (let i=0; i<this.invoices.length;i++){
      if(this.invoices[i].invoiceId == invoiceId){
        return this.invoices[i];
      }
    }
  }
  getInvoiceByCustId(custId){
    this.invoices = [];
    this.populateInvoices();
    let invoiceByCustId = [];
    for (let i=0; i<this.invoices.length;i++){
      if(this.invoices[i].customerId == custId){
        invoiceByCustId.push(this.invoices[i])
      }
    }
    return invoiceByCustId;
  }
}
