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
				animate('0.5s', keyframes([
					style({ marginRight: '0', offset: 0 }),
					style({ marginRight: '0', offset: 0.6 }),
					style({ marginRight: '-250px', offset: 1 }),
				]))
			]),
			transition('closed => open', [
				animate('0.2s', style({ marginRight: 0 }))
			]),
		]),
	]
})
export class AppComponent implements OnInit {

	public rippleColor = 'white';
	public smallMenuOpen = false;

	private asleep = true;

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

	public closeMenu() {
		this.smallMenuOpen = false;
		this.sbs.preventScrolling(false);
	}

	public loggedIn(): boolean {
		return localStorage.getItem('currentUser') !== null;
	}

	public isAdmin(): boolean {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		return (currentUser && currentUser.admin);
	}
}
