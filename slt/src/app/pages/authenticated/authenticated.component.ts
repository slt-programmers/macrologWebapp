import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollBehaviourService } from '../../services/scroll-behaviour.service';
import { HealthcheckService } from '../../services/healthcheck.service';
import { trigger, transition, style, animate, state, keyframes } from '@angular/animations';

@Component({
	selector: 'authenticated',
	templateUrl: './authenticated.component.html',
	styleUrls: ['./authenticated.component.scss'],
	animations: [
		trigger('move', [
			state('forth', style({
				marginLeft: '-75px'
			})),
			state('back', style({
				marginLeft: '0'
			})),
			transition('* <=> *', [
				animate('5s 0s ease-in-out')
			])
		]),
		trigger('moveDelay', [
			state('forth', style({
				marginRight: '-75px'
			})),
			state('back', style({
				marginRight: '0'
			})),
			transition('* <=> *', [
				animate('4s 0s ease-in-out')
			])
		]),
		trigger('openClose', [
			state('open', style({
				marginRight: '0'
			})),
			state('closed', style({
				marginRight: '-250px'
			})),
			transition('open => closed', [
				animate('0.5s ease', keyframes([
					style({ marginRight: '0', offset: 0 }),
					style({ marginRight: '0', offset: 0.6 }),
					style({ marginRight: '-250px', offset: 1 }),
				]))
			]),
			transition('closed => open', [
				animate('0.2s 0s ease-out', style({ marginRight: 0 }))
			]),
		]),
	]
})
export class AuthenticatedComponent implements OnInit {

	public moveState = 'forth';
	public moveDelayState = 'forth';
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

	public onMove(event: any) {
		this.moveState = this.moveState === 'forth' ? 'back' : 'forth';
	}

	public onMoveDelay(event: any) {
		this.moveDelayState = this.moveDelayState === 'forth' ? 'back' : 'forth';
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