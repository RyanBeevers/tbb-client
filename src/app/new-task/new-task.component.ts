import { Component, OnInit } from '@angular/core';
import { TaskServiceService } from './../core/services/task-service.service'
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {
  user: User = {};

  constructor(
    private taskService: TaskServiceService,
    private userService: UserService,
    private router: Router,
    ) { }
  image=''; 
  cardTitle;
  cardImg;
  cardTitle2;
  cardDesc;
  cardPricingDetail;
  service = [];

  ngOnInit() {
    window.scrollTo(0, 0)
    if(!this.userService.isAuthenticated()){
      this.router.navigate(['/not-authorized']);
    }
    
    this.service = this.taskService.getServiceData();
    if (this.service.length > 0){
      this.cardTitle=this.service[0];
      this.cardImg =this.service[1];
      this.cardTitle2=this.service[2];
      this.cardDesc=this.service[3];
      this.cardPricingDetail=this.service[4];
      this.service = [];
      this.taskService.setServiceData(this.service)
    }else{
      console.log('none')
    }
  }
  
  showModal(i):void {
    $("#myModal").modal('show');

  }
  sendModal(): void {
    //do something here
    this.hideModal();
  }
  hideModal():void {
    document.getElementById('close-modal').click();
  }

}
