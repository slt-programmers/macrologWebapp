import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  @ViewChild('navbar') private navbarElement: ElementRef;
	@ViewChild('navbarBackdrop') private backdropElement: ElementRef;

  public title: string;
	private navbar;
	private backdrop;

	public userTitle: string = 'Settings';
	public logTitle: string = 'Food diary';
	public graphsTitle: string = 'Graphs';
	public mealsTitle: string = 'Meals';
	public foodTitle: string = 'All food';

  constructor() {}

  ngOnInit() {
		this.navbar = this.navbarElement.nativeElement;
		this.backdrop = this.backdropElement.nativeElement;
  }

	// Navigation
	openNav() {
		this.navbar.style.marginLeft = '0';
		this.backdrop.style.display = 'block';
		this.backdrop.style.backgroundColor = 'rgba(0,0,0, 0.4)';
	}

	closeNav(tabTitle: string) {
		this.title = tabTitle;
		this.navbar.style.marginLeft = '-300px';
		this.backdrop.style.display = 'none';
		this.backdrop.style.backgroundColor = 'transparent';
	}

  public username() {
    if (localStorage.getItem('currentUser') === null){
      return "Guest";
    } else {
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      return currentUser.user;
    }
  }

  public loggedIn(){
		const loggedInBoolean = localStorage.getItem('currentUser') !== null;
    return loggedInBoolean;
  }

}
