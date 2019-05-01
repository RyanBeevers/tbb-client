import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-me',
  templateUrl: './text-me.component.html',
  styleUrls: ['./text-me.component.scss']
})
export class TextMeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.scrollTo(0, 0)
  }

}
