import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public menuToggle = false;

  constructor() { }

  ngOnInit() {
  }

  public toggleMenu() {
    console.log('Toggle')
    this.menuToggle = !this.menuToggle;
  }
}
