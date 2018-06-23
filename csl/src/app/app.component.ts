import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title: string;
	public navToggle: boolean = false;

  constructor() {}

  ngOnInit() {
    this.title = 'Macrolog Webapp';
  }

}
