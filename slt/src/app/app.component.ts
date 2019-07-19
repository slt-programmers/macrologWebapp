import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollBehaviourService } from './services/scroll-behaviour.service';
import { HealthcheckService } from './services/healthcheck.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {

	@ViewChild('navbar', { static: false }) private navbarElement;
	@ViewChild('navbarBackdrop', { static: false }) private backdropElement: ElementRef;
	@ViewChild('usermenu', { static: false }) private userMenuElement: ElementRef;
	@ViewChild('usermenuBackdrop', { static: false }) private usermenubackdropElement: ElementRef;

	public title: string;

	private asleep = true;
	private navbar;
	private backdrop;
	private usermenu;
	private usermenubackdrop;

	public userTitle = 'Settings';
	public profileTitle = 'Profile';
	public adminTitle = 'Administration panel';
	public changePasswordTitle = 'Reset password';

	public currentRoute;

	constructor(public router: Router,
		private renderer: Renderer2,
		private healthcheckService: HealthcheckService,
		private sbs: ScrollBehaviourService) {
		this.healthcheckService.checkState().subscribe(result => {
			this.asleep = !result;
		}, error => {
			console.log(error);
			if (error.status === 403) {
				this.asleep = !error;
			}
		});
		sbs.renderer = renderer;
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		this.navbar = this.navbarElement.nativeElement;
		this.backdrop = this.backdropElement.nativeElement;
		this.usermenu = this.userMenuElement.nativeElement;
		this.usermenubackdrop = this.usermenubackdropElement.nativeElement;
	}

	public stillSleeping(): boolean {
		return this.asleep;
	}

	// Navigation
	public openNav() {
		this.navbar.style.marginRight = '0';
		this.backdrop.style.display = 'block';
		this.backdrop.style.backgroundColor = 'rgba(0,0,0, 0.4)';
		this.sbs.preventScrolling(true);
	}

	public closeNav(tabTitle: string) {
		this.setTitle(tabTitle);
		const width = this.navbar.clientWidth;

		this.navbar.style.marginRight = '-' + width + 'px';
		this.backdrop.style.display = 'none';
		this.backdrop.style.backgroundColor = 'transparent';
		this.sbs.preventScrolling(false);
	}

	public setTitle(tabTitle: string) {
		if (tabTitle) {
			this.title = tabTitle;
		}
	}

	public getUsername() {
		if (localStorage.getItem('currentUser') === null) {
			return 'Guest';
		} else {
			const currentUser = JSON.parse(localStorage.getItem('currentUser'));
			return currentUser.user;
		}
	}

	public loggedIn(): boolean {
		return localStorage.getItem('currentUser') !== null;
	}

	public isAdmin(): boolean {
		const currentUser =  JSON.parse(localStorage.getItem('currentUser'));
		return (currentUser.user === 'CarmenDev' || currentUser.user === 'arjantienkamp@gmail.com');
	}

	public openUserMenu() {
		this.usermenu.style.marginTop = '0';
		this.usermenubackdrop.style.display = 'block';
		this.sbs.preventScrolling(true);
	}

	public closeUserMenu() {
		this.usermenu.style.marginTop = '-300px';
		this.usermenubackdrop.style.display = 'none';
		this.usermenubackdrop.style.backgroundColor = 'transparent';
		this.sbs.preventScrolling(false);
	}
}
