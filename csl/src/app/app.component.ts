import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  @ViewChild('navbar') private navbarElement: ElementRef;
	@ViewChild('navbarBackdrop') private backdropElement: ElementRef;
  @ViewChild('usermenu') private userMenuElement: ElementRef;
	@ViewChild('usermenuBackdrop') private usermenubackdropElement: ElementRef;

  public title: string;
	private navbar;
	private backdrop;
  private usermenu;
  private usermenubackdrop;

	public userTitle: string = 'Settings';
  public profileTitle:string = 'My profile';
  public resetPasswordTitle:string = 'Reset password';

  constructor() {}

  ngOnInit() {
		this.navbar = this.navbarElement.nativeElement;
		this.backdrop = this.backdropElement.nativeElement;
		this.usermenu = this.userMenuElement.nativeElement;
		this.usermenubackdrop = this.usermenubackdropElement.nativeElement;
  }

	// Navigation
	openNav() {
		this.navbar.style.marginRight = '0';
		this.backdrop.style.display = 'block';
		this.backdrop.style.backgroundColor = 'rgba(0,0,0, 0.4)';
	}

	closeNav(tabTitle: string) {
		this.setTitle(tabTitle);
		const width = this.navbar.clientWidth;

		this.navbar.style.marginRight = '-' + width + 'px';
		this.backdrop.style.display = 'none';
		this.backdrop.style.backgroundColor = 'transparent';
	}

  setTitle(tabTitle: string) {
    if (tabTitle){
		  this.title = tabTitle;
    }
  }

  public getUsername() {
    if (localStorage.getItem('currentUser') === null){
      return "Guest";
    } else {
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      return currentUser.user;
    }
  }

  public loggedIn(): boolean {
		return localStorage.getItem('currentUser') !== null;
  }

  public showUserMenu(){
    this.usermenu.style.marginTop = '0';
		this.usermenubackdrop.style.display = 'block';
  }

  public closeUserMenu() {
		this.usermenu.style.marginTop = '-300px';
		this.usermenubackdrop.style.display = 'none';
		this.usermenubackdrop.style.backgroundColor = 'transparent';
	}

}
