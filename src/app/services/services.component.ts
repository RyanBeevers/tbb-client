import { Component, OnInit } from '@angular/core';
import { TaskServiceService } from './../core/services/task-service.service'
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  
  user: User = {};

  constructor(
    private taskService: TaskServiceService,
    private userService: UserService,
    private router: Router,
    ) { }

  admin;
  cardTitle = [
    'Event Planning',
    'Travel Management',
    'Administrative Assistant',
    'Virtual Assistant',
  ];
  cardImg = [
    'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?cs=srgb&dl=businessmen-classroom-communication-267507.jpg&fm=jpg',
    'https://images.pexels.com/photos/1204649/pexels-photo-1204649.jpeg?cs=srgb&dl=brainstorming-collaborate-collaboration-1204649.jpg&fm=jpg',
    'http://www.intheblack.com/~/media/intheblack/allimages/sponsored-content/2018/dexus-office-space.jpg',
    'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE28gcp?ver=be70&q=90&m=2&h=768&w=1024&b=%23FFFFFFFF&aim=true'
  ];
  cardTitle2 = [
    'Title1',
    'Title2',
    'Title3',
    'Title4'
  ];
  cardDesc = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et sollicitudin ac orci phasellus egestas tellus. Phasellus faucibus scelerisque eleifend donec.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dignissim suspendisse in est ante in. Orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget mi proin sed libero enim sed faucibus turpis in. Sed enim ut sem viverra aliquet eget.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Bibendum est ultricies integer quis auctor elit sed vulputate mi. Senectus et netus et malesuada.'
  ];
  cardPricingDetail = [
    '$16-$18 Per Hour',
    '$20-$22 Per Hour',
    '$10-$12 Per Hour',
    '$1-$2 Per Hour',
  ];
  modalData = [];

  ngOnInit() {
    window.scrollTo(0, 0)
    if(this.userService.isAuthenticated()){
      this.admin=this.userService.isAdmin();
    }
  }
  setEditData(i){
    this.modalData = [
      this.cardTitle[i],
      this.cardImg[i],
      this.cardTitle2[i],
      this.cardDesc[i],
      this.cardPricingDetail[i]
    ]
    this.taskService.setServiceData(this.modalData);
  }
  showModal(i):void {
    this.modalData = [
      this.cardTitle[i],
      this.cardImg[i],
      this.cardTitle2[i],
      this.cardDesc[i],
      this.cardPricingDetail[i]
    ]
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
