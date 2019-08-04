import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollBehaviourService } from './services/scroll-behaviour.service';
import { HealthcheckService } from './services/healthcheck.service';
import { trigger, transition, style, animate, state, keyframes } from '@angular/animations';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	animations: [
		trigger('openClose', [
			state('open', style({
				marginRight: '0'
			})),
			state('closed', style({
				marginRight: '-250px'
			})),
			transition('open => closed', [
				animate('0.6s', keyframes([
					style({ marginRight: '0', offset: 0 }),
					style({ marginRight: '0', offset: 0.5 }),
					style({ marginRight: '-250px', offset: 1 }),
				]))
			]),
			transition('closed => open', [
				animate('0.3s', style({ marginRight: 0 }))
			]),
		]),
	]
})
export class AppComponent implements OnInit {

	@ViewChild('smallMenu', { static: false }) public smallMenuElement: ElementRef;

	public title = '';
	public diaryTitle = 'Diary';
	public foodTitle = 'Food';
	public dishTitle = 'Dishes';
	public profileTitle = 'Profile';
	public adminTitle = 'Administration panel';
	public changePasswordTitle = 'Reset password';

	public rippleColor = 'white';
	public smallMenuOpen = false;

	private asleep = true;

	public currentRoute;

	constructor(public router: Router,
		private healthcheckService: HealthcheckService,
		private sbs: ScrollBehaviourService,
		private renderer: Renderer2) {
	}

	ngOnInit() {
		this.healthcheckService.checkState().subscribe(result => {
			this.asleep = !result;
		}, error => {
			if (error.status === 403) {
				this.asleep = !error;
			}
		});
		this.sbs.renderer = this.renderer;
	}

	public stillSleeping(): boolean {
		return this.asleep;
	}

	public openMenu() {
		this.smallMenuOpen = !this.smallMenuOpen;
		if (this.smallMenuOpen) {
			this.sbs.preventScrolling(true);
		}
	}

	public closeMenu(tabTitle: string) {
		this.setTitle(tabTitle);
		this.smallMenuOpen = false;
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
			return currentUser.userName;
		}
	}

	public loggedIn(): boolean {
		return localStorage.getItem('currentUser') !== null;
	}

	public isAdmin(): boolean {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		return (currentUser && currentUser.admin);
	}
}
