import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('navbar') private navbarElement: ElementRef;

  public title: string;
	private navbar;
	public navToggle: boolean = false;

  constructor() {}

  ngOnInit() {
    this.title = 'Macrolog Webapp';
		this.navbar = this.navbarElement.nativeElement;
		console.log(this.navbar);
		console.log(this.navbarElement);
		this.approot = this.navbar.parentElement;
		this.body = this.approot.parentElement;
		console.log(this.approot);
		console.log(this.body);
  }


	// Navigation
	openNav() {
		this.navbar.style.marginLeft = '0';
		this.navbar.style.width = '100%';
	}

	closeNav() {
		this.navbar.style.marginLeft = '-300px';
		this.navbar.style.width = 'auto';
	}

}
