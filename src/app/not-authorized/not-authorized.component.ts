import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss']
})
export class NotAuthorizedComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.scrollTo(0, 0)
  }

}
